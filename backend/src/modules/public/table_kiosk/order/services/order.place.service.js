import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../../core/constants/error/index.js";
import { getIO } from "../../../../../core/utils/socket.js";

export const placeTableKioskOrderService = async ({ restaurantId, tableId, items, reservationId = null, customerNotes = "" }) => {
    if (!items || items.length === 0) {
        throw new BadRequestError("Vui lòng chọn ít nhất một món ăn");
    }

    const table = await prisma.tables.findFirst({
        where: { id: tableId, restaurantId },
        include: { 
            restaurant: {
                include: { brand: true }
            } 
        }
    });

    if (!table) {
        throw new NotFoundError("Không tìm thấy bàn yêu cầu");
    }

    // 1. Tính toán cấu hình Thuế & Phí phục vụ: Brand -> Restaurant
    const brandTaxConfig = table.restaurant?.brand?.taxConfig;
    const restaurantTaxConfig = table.restaurant?.taxConfig;

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

    let subtotal = 0;
    const formattedOrderItems = [];

    for (const item of items) {
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: item.menuItemId }
        });

        if (!menuItem) {
            throw new NotFoundError(`Món ăn ID ${item.menuItemId} không tồn tại`);
        }

        const price = Number(menuItem.base_price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        formattedOrderItems.push({
            menuItemId: menuItem.id,
            name: menuItem.name,
            quantity: quantity,
            unitPrice: price,
            subtotal: itemTotal,
            discountAmount: 0,
            totalPrice: itemTotal,
            note: item.notes || item.note || "",
            status: "QUEUED"
        });
    }

    let existingOrder = await prisma.order.findFirst({
        where: {
            tableId: tableId,
            status: {
                notIn: ["CANCELLED", "PAID"]
            }
        },
        include: { items: true }
    });

    let savedOrder;

    if (existingOrder) {
        const newSubtotal = existingOrder.subtotal + subtotal;
        const serviceFee = (effectiveTaxConfig.applyServiceCharge && effectiveTaxConfig.serviceChargeRate > 0)
            ? Math.round(newSubtotal * (effectiveTaxConfig.serviceChargeRate / 100))
            : 0;
        
        const taxableAmount = Math.max(0, newSubtotal + serviceFee - existingOrder.discount_amount);
        const newTaxAmount = (!effectiveTaxConfig.isVatInclusive && effectiveTaxConfig.defaultVatRate > 0)
            ? Math.round(taxableAmount * (effectiveTaxConfig.defaultVatRate / 100))
            : 0;
        
        const newTotalAmount = Math.max(0, newSubtotal + serviceFee + newTaxAmount - existingOrder.discount_amount);

        savedOrder = await prisma.order.update({
            where: { id: existingOrder.id },
            data: {
                subtotal: newSubtotal,
                tax_amount: newTaxAmount,
                total_amount: newTotalAmount,
                status: "OPEN",
                items: {
                    create: formattedOrderItems
                }
            },
            include: { items: true }
        });
    } else {
        const serviceFee = (effectiveTaxConfig.applyServiceCharge && effectiveTaxConfig.serviceChargeRate > 0)
            ? Math.round(subtotal * (effectiveTaxConfig.serviceChargeRate / 100))
            : 0;

        const discountAmount = 0;
        const taxableAmount = Math.max(0, subtotal + serviceFee - discountAmount);
        const taxAmount = (!effectiveTaxConfig.isVatInclusive && effectiveTaxConfig.defaultVatRate > 0)
            ? Math.round(taxableAmount * (effectiveTaxConfig.defaultVatRate / 100))
            : 0;

        const totalAmount = Math.max(0, subtotal + serviceFee + taxAmount - discountAmount);
        const randomOrderNum = `ORD-${table.table_number}-${Date.now().toString().slice(-4)}`;

        let finalReservationId = reservationId;
        if (!finalReservationId) {
            const activeResTable = await prisma.reservation_Tables.findFirst({
                where: {
                    tableId: tableId,
                    reservation: { status: "SEATED" }
                }
            });
            finalReservationId = activeResTable?.reservationId;
        }

        if (!finalReservationId) {
            const walkInRes = await prisma.reservations.create({
                data: {
                    confirmation_code: `WI-${Date.now().toString().slice(-6)}`,
                    restaurantId: restaurantId,
                    guest_name: `Khách Bàn ${table.table_number}`,
                    guest_phone: "0900000000",
                    reservation_date: new Date(),
                    start_time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                    end_time: "23:59",
                    party_size: table.max_capacity || 4,
                    status: "SEATED",
                    source: "WALK_IN"
                }
            });
            finalReservationId = walkInRes.id;

            await prisma.reservation_Tables.create({
                data: {
                    reservationId: walkInRes.id,
                    tableId: tableId
                }
            });
        }

        savedOrder = await prisma.order.create({
            data: {
                order_number: randomOrderNum,
                reservationId: finalReservationId,
                restaurantId: restaurantId,
                tableId: tableId,
                status: "OPEN",
                subtotal,
                discount_amount: discountAmount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                items: {
                    create: formattedOrderItems
                }
            },
            include: { items: true }
        });
    }

    try {
        const io = getIO();
        io.to(`restaurant_${restaurantId}`).emit("new_kitchen_ticket", {
            orderId: savedOrder.id,
            orderNumber: savedOrder.order_number,
            tableNumber: table.table_number,
            items: formattedOrderItems,
            createdAt: new Date().toISOString()
        });

        io.to(`restaurant_${restaurantId}`).emit("order_updated", {
            restaurantId,
            tableId,
            orderId: savedOrder.id
        });

        io.to(`table_${restaurantId}_${tableId}`).emit("table_order_updated", {
            order: savedOrder
        });
    } catch (err) {
        console.error("Socket emit order error:", err);
    }

    return savedOrder;
};
