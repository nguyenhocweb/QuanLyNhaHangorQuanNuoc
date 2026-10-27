import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../../core/constants/error/index.js";
import { getIO } from "../../../../../core/utils/socket.js";

/**
 * Áp dụng mã giảm giá / Voucher khuyến mãi cho bàn ăn trên Tablet Kiosk
 */
export const applyTableKioskPromotionService = async ({ restaurantId, tableId, code }) => {
    if (!code || !code.trim()) {
        throw new BadRequestError("Vui lòng nhập mã giảm giá");
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Tìm đơn hàng hiện tại của bàn
    const activeOrder = await prisma.order.findFirst({
        where: {
            tableId: tableId,
            restaurantId: restaurantId,
            status: {
                notIn: ["CANCELLED", "PAID"]
            }
        },
        include: {
            items: true,
            restaurant: {
                include: { brand: true }
            },
            table: true
        }
    });

    if (!activeOrder) {
        throw new BadRequestError("Bàn chưa có đơn hàng hoạt động để áp dụng mã giảm giá. Vui lòng gửi gọi món trước.");
    }

    if (activeOrder.subtotal <= 0) {
        throw new BadRequestError("Giá trị đơn hàng phải lớn hơn 0 để áp dụng mã giảm giá.");
    }

    // 2. Tìm mã khuyến mãi trong Database
    const promotion = await prisma.promotion.findFirst({
        where: {
            code: cleanCode,
            isActive: true
        },
        include: {
            promotionRestaurants: true
        }
    });

    if (!promotion) {
        throw new NotFoundError(`Mã giảm giá "${cleanCode}" không tồn tại hoặc đã hết hiệu lực.`);
    }

    const now = new Date();
    if (promotion.valid_from && new Date(promotion.valid_from) > now) {
        throw new BadRequestError(`Mã giảm giá "${cleanCode}" chưa đến ngày bắt đầu áp dụng.`);
    }

    if (promotion.valid_until && new Date(promotion.valid_until) < now) {
        throw new BadRequestError(`Mã giảm giá "${cleanCode}" đã hết hạn sử dụng.`);
    }

    if (promotion.usage_limit && promotion.used_count >= promotion.usage_limit) {
        throw new BadRequestError(`Mã giảm giá "${cleanCode}" đã hết lượt sử dụng.`);
    }

    // Kiểm tra phạm vi áp dụng (Nhà hàng hoặc Thương hiệu)
    const restaurant = activeOrder.restaurant;
    const isBrandValid = !promotion.brandId || (restaurant?.brandId && promotion.brandId === restaurant.brandId);
    const isRestaurantValid = !promotion.restaurantId || (promotion.restaurantId === restaurantId);
    const isInPromotionRestaurants = promotion.promotionRestaurants && promotion.promotionRestaurants.length > 0
        ? promotion.promotionRestaurants.some(pr => pr.restaurantId === restaurantId)
        : true;

    if (!isBrandValid || (!isRestaurantValid && !isInPromotionRestaurants)) {
        throw new BadRequestError(`Mã giảm giá "${cleanCode}" không áp dụng cho chi nhánh nhà hàng này.`);
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (promotion.min_order_value && activeOrder.subtotal < promotion.min_order_value) {
        throw new BadRequestError(
            `Đơn hàng cần đạt tối thiểu ${promotion.min_order_value.toLocaleString("vi-VN")}đ để sử dụng mã này (Hiện tại: ${activeOrder.subtotal.toLocaleString("vi-VN")}đ).`
        );
    }

    // 3. Tính toán số tiền giảm giá
    let discountAmount = 0;
    if (promotion.discount_type === "PERCENTAGE") {
        const rawDiscount = Math.round(activeOrder.subtotal * (promotion.discount_value / 100));
        if (promotion.max_discount && promotion.max_discount > 0) {
            discountAmount = Math.min(rawDiscount, promotion.max_discount);
        } else {
            discountAmount = rawDiscount;
        }
    } else {
        // FIXED_AMOUNT
        discountAmount = Math.min(promotion.discount_value, activeOrder.subtotal);
    }

    // 4. Tính toán lại thuế và phí theo effectiveTaxConfig
    const brandTaxConfig = restaurant?.brand?.taxConfig;
    const restaurantTaxConfig = restaurant?.taxConfig;

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

    const serviceFee = (effectiveTaxConfig.applyServiceCharge && effectiveTaxConfig.serviceChargeRate > 0)
        ? Math.round(activeOrder.subtotal * (effectiveTaxConfig.serviceChargeRate / 100))
        : 0;

    const taxableAmount = Math.max(0, activeOrder.subtotal + serviceFee - discountAmount);
    const newTaxAmount = (!effectiveTaxConfig.isVatInclusive && effectiveTaxConfig.defaultVatRate > 0)
        ? Math.round(taxableAmount * (effectiveTaxConfig.defaultVatRate / 100))
        : 0;

    const newTotalAmount = Math.max(0, activeOrder.subtotal + serviceFee + newTaxAmount - discountAmount);

    // 5. Cập nhật Order & Tăng lượt dùng Promotion
    const updatedOrder = await prisma.order.update({
        where: { id: activeOrder.id },
        data: {
            discount_amount: discountAmount,
            tax_amount: newTaxAmount,
            total_amount: newTotalAmount
        },
        include: {
            items: true,
            table: true
        }
    });

    await prisma.promotion.update({
        where: { id: promotion.id },
        data: {
            used_count: { increment: 1 }
        }
    });

    // 6. Phát Socket Real-time
    try {
        const io = getIO();
        io.to(`restaurant_${restaurantId}`).emit("order_updated", {
            restaurantId,
            tableId,
            orderId: updatedOrder.id
        });

        io.to(`table_${restaurantId}_${tableId}`).emit("table_order_updated", {
            order: updatedOrder
        });
    } catch (err) {
        console.error("Socket emit promotion error:", err);
    }

    return {
        message: `Áp dụng mã giảm giá "${cleanCode}" thành công! Tiết kiệm ${discountAmount.toLocaleString("vi-VN")}đ`,
        discountAmount,
        promotionCode: cleanCode,
        order: updatedOrder
    };
};

/**
 * Gỡ bỏ mã giảm giá khỏi đơn hàng bàn ăn
 */
export const removeTableKioskPromotionService = async ({ restaurantId, tableId }) => {
    const activeOrder = await prisma.order.findFirst({
        where: {
            tableId: tableId,
            restaurantId: restaurantId,
            status: {
                notIn: ["CANCELLED", "PAID"]
            }
        },
        include: {
            restaurant: {
                include: { brand: true }
            },
            items: true,
            table: true
        }
    });

    if (!activeOrder) {
        throw new NotFoundError("Không tìm thấy đơn hàng của bàn");
    }

    const restaurant = activeOrder.restaurant;
    const brandTaxConfig = restaurant?.brand?.taxConfig;
    const restaurantTaxConfig = restaurant?.taxConfig;

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

    const serviceFee = (effectiveTaxConfig.applyServiceCharge && effectiveTaxConfig.serviceChargeRate > 0)
        ? Math.round(activeOrder.subtotal * (effectiveTaxConfig.serviceChargeRate / 100))
        : 0;

    const taxableAmount = Math.max(0, activeOrder.subtotal + serviceFee);
    const newTaxAmount = (!effectiveTaxConfig.isVatInclusive && effectiveTaxConfig.defaultVatRate > 0)
        ? Math.round(taxableAmount * (effectiveTaxConfig.defaultVatRate / 100))
        : 0;

    const newTotalAmount = Math.max(0, activeOrder.subtotal + serviceFee + newTaxAmount);

    const updatedOrder = await prisma.order.update({
        where: { id: activeOrder.id },
        data: {
            discount_amount: 0,
            tax_amount: newTaxAmount,
            total_amount: newTotalAmount
        },
        include: {
            items: true,
            table: true
        }
    });

    try {
        const io = getIO();
        io.to(`restaurant_${restaurantId}`).emit("order_updated", {
            restaurantId,
            tableId,
            orderId: updatedOrder.id
        });

        io.to(`table_${restaurantId}_${tableId}`).emit("table_order_updated", {
            order: updatedOrder
        });
    } catch (err) {
        console.error("Socket emit remove promotion error:", err);
    }

    return {
        message: "Đã gỡ bỏ mã giảm giá thành công",
        order: updatedOrder
    };
};
