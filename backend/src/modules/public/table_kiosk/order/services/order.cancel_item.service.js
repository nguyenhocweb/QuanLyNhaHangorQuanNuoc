import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../../core/constants/error/index.js";
import { getIO } from "../../../../../core/utils/socket.js";

/**
 * Hủy món ăn từ Tablet Kiosk khi khách lỡ bấm hoặc đổi ý
 * Quy tắc:
 * - CHỈ được hủy khi món đang ở trạng thái 'QUEUED' (Đang tiếp nhận, chưa nấu).
 * - KHÔNG ĐƯỢC hủy khi món đã 'PREPARING' (Đang nấu), 'READY' (Đã xong), 'SERVING'/'SERVED' (Đã lên bàn).
 */
export const cancelTableKioskOrderItemService = async ({ restaurantId, tableId, orderItemId, reason = "Khách hủy trên Tablet Kiosk" }) => {
    if (!orderItemId) {
        throw new BadRequestError("Vui lòng cung cấp mã món ăn cần hủy");
    }

    const orderItem = await prisma.orderItem.findUnique({
        where: { id: orderItemId },
        include: {
            order: {
                include: {
                    table: true,
                    restaurant: {
                        include: { brand: true }
                    }
                }
            }
        }
    });

    if (!orderItem) {
        throw new NotFoundError("Không tìm thấy món ăn trong đơn");
    }

    // Kiểm tra tính toàn vẹn của Bàn và Chi nhánh
    if (orderItem.order.tableId !== tableId || orderItem.order.restaurantId !== restaurantId) {
        throw new BadRequestError("Món ăn không thuộc về bàn ăn hiện tại");
    }

    // Kiểm tra trạng thái chế biến
    if (orderItem.status === "CANCELLED") {
        throw new BadRequestError("Món ăn này đã được hủy trước đó");
    }

    if (orderItem.status !== "QUEUED") {
        const statusMap = {
            PREPARING: "đang được đầu bếp chế biến",
            READY: "đã chế biến xong",
            SERVING: "đang được mang ra bàn",
            SERVED: "đã phục vụ lên bàn"
        };
        const statusText = statusMap[orderItem.status] || "đã vào quy trình bếp";
        throw new BadRequestError(`Món "${orderItem.name}" ${statusText}, không thể tự hủy. Quý khách vui lòng liên hệ nhân viên phục vụ để được hỗ trợ!`);
    }

    // Tiến hành hủy món
    await prisma.orderItem.update({
        where: { id: orderItemId },
        data: {
            status: "CANCELLED",
            note: orderItem.note ? `${orderItem.note} | [ĐÃ HỦY: ${reason}]` : `[ĐÃ HỦY: ${reason}]`
        }
    });

    // Tính toán cấu hình Thuế & Phí phục vụ: Brand -> Restaurant
    const brandTaxConfig = orderItem.order.restaurant?.brand?.taxConfig;
    const restaurantTaxConfig = orderItem.order.restaurant?.taxConfig;

    let effectiveTaxConfig = {
        isVatInclusive: false,
        defaultVatRate: 0,
        applyServiceCharge: false,
        serviceChargeRate: 0
    };

    if (brandTaxConfig) {
        if (brandTaxConfig.forceGlobalTaxConfig) {
            effectiveTaxConfig = {
                isVatInclusive: brandTaxConfig.isVatInclusive || false,
                defaultVatRate: Number(brandTaxConfig.defaultVatRate) || 0,
                applyServiceCharge: brandTaxConfig.applyServiceCharge || false,
                serviceChargeRate: Number(brandTaxConfig.serviceChargeRate) || 0
            };
        } else {
            effectiveTaxConfig = {
                isVatInclusive: restaurantTaxConfig?.isVatInclusive ?? brandTaxConfig.isVatInclusive ?? false,
                defaultVatRate: Number(restaurantTaxConfig?.defaultVatRate ?? brandTaxConfig.defaultVatRate ?? 0),
                applyServiceCharge: restaurantTaxConfig?.applyServiceCharge ?? brandTaxConfig.applyServiceCharge ?? false,
                serviceChargeRate: Number(restaurantTaxConfig?.serviceChargeRate ?? brandTaxConfig.serviceChargeRate ?? 0)
            };
        }
    } else if (restaurantTaxConfig) {
        effectiveTaxConfig = {
            isVatInclusive: restaurantTaxConfig.isVatInclusive || false,
            defaultVatRate: Number(restaurantTaxConfig.defaultVatRate) || 0,
            applyServiceCharge: restaurantTaxConfig.applyServiceCharge || false,
            serviceChargeRate: Number(restaurantTaxConfig.serviceChargeRate) || 0
        };
    }

    // Tính toán lại tổng tiền của Order (trừ tiền món đã hủy)
    const itemSubtotalToDeduct = orderItem.totalPrice || orderItem.subtotal || (orderItem.unitPrice * orderItem.quantity);
    const currentOrder = orderItem.order;

    const newSubtotal = Math.max(0, currentOrder.subtotal - itemSubtotalToDeduct);
    const serviceFee = (effectiveTaxConfig.applyServiceCharge && effectiveTaxConfig.serviceChargeRate > 0)
        ? Math.round(newSubtotal * (effectiveTaxConfig.serviceChargeRate / 100))
        : 0;

    const taxableAmount = Math.max(0, newSubtotal + serviceFee - currentOrder.discount_amount);
    const newTaxAmount = (!effectiveTaxConfig.isVatInclusive && effectiveTaxConfig.defaultVatRate > 0)
        ? Math.round(taxableAmount * (effectiveTaxConfig.defaultVatRate / 100))
        : 0;

    const newTotalAmount = Math.max(0, newSubtotal + serviceFee + newTaxAmount - currentOrder.discount_amount);

    const updatedOrder = await prisma.order.update({
        where: { id: currentOrder.id },
        data: {
            subtotal: newSubtotal,
            tax_amount: newTaxAmount,
            total_amount: newTotalAmount
        },
        include: {
            items: true,
            table: true
        }
    });

    // Bắn WebSocket thông báo Real-time cho Bếp và POS
    try {
        const io = getIO();
        io.to(`restaurant_${restaurantId}`).emit("kitchen_item_cancelled", {
            orderId: updatedOrder.id,
            orderItemId,
            itemName: orderItem.name,
            tableNumber: orderItem.order.table?.table_number,
            reason,
            cancelledAt: new Date().toISOString()
        });

        io.to(`restaurant_${restaurantId}`).emit("order_updated", {
            restaurantId,
            tableId,
            orderId: updatedOrder.id
        });

        io.to(`table_${restaurantId}_${tableId}`).emit("table_order_updated", {
            order: updatedOrder
        });
    } catch (err) {
        console.error("Socket emit cancel item error:", err);
    }

    return {
        message: `Đã hủy món "${orderItem.name}" thành công`,
        order: updatedOrder
    };
};
