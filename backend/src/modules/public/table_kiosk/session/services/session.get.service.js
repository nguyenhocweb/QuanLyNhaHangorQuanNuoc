import { prisma } from "../../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";

export const getTableKioskSessionService = async (restaurantId, tableId) => {
    const table = await prisma.tables.findFirst({
        where: {
            id: tableId,
            restaurantId: restaurantId
        },
        include: {
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    imageMain: true,
                    address: true,
                    brandId: true,
                    taxConfig: true,
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                            taxConfig: true
                        }
                    }
                }
            }
        }
    });

    if (!table) {
        throw new NotFoundError("Không tìm thấy bàn trong hệ thống");
    }

    const activeReservationTable = await prisma.reservation_Tables.findFirst({
        where: {
            tableId: tableId,
            reservation: {
                restaurantId: restaurantId,
                status: "SEATED"
            }
        },
        include: {
            reservation: {
                select: {
                    id: true,
                    confirmation_code: true,
                    guest_name: true,
                    guest_phone: true,
                    party_size: true,
                    reservation_date: true,
                    start_time: true,
                    special_requests: true,
                    occasion: true,
                    status: true,
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const activeReservation = activeReservationTable?.reservation || null;

    let activeOrder = null;
    if (activeReservation) {
        activeOrder = await prisma.order.findFirst({
            where: {
                reservationId: activeReservation.id,
                status: {
                    notIn: ["CANCELLED", "PAID"]
                }
            },
            include: {
                items: {
                    include: {
                        menuItem: {
                            select: {
                                id: true,
                                name: true,
                                base_price: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    if (!activeOrder) {
        activeOrder = await prisma.order.findFirst({
            where: {
                tableId: tableId,
                status: {
                    notIn: ["CANCELLED", "PAID"]
                }
            },
            include: {
                items: {
                    include: {
                        menuItem: {
                            select: {
                                id: true,
                                name: true,
                                base_price: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    const sessionStatus = (activeReservation || activeOrder) ? "SEATED" : "IDLE";

    // Tính toán cấu hình thuế & phí theo thứ tự ưu tiên: Brand -> Restaurant
    const brandTaxConfig = table.restaurant?.brand?.taxConfig;
    const restaurantTaxConfig = table.restaurant?.taxConfig;

    let effectiveTaxConfig = {
        isVatInclusive: false,
        defaultVatRate: 0,
        applyServiceCharge: false,
        serviceChargeRate: 0,
        source: 'NONE'
    };

    if (brandTaxConfig) {
        if (brandTaxConfig.forceGlobalTaxConfig) {
            effectiveTaxConfig = {
                isVatInclusive: brandTaxConfig.isVatInclusive || false,
                defaultVatRate: Number(brandTaxConfig.defaultVatRate) || 0,
                applyServiceCharge: brandTaxConfig.applyServiceCharge || false,
                serviceChargeRate: Number(brandTaxConfig.serviceChargeRate) || 0,
                source: 'BRAND'
            };
        } else {
            effectiveTaxConfig = {
                isVatInclusive: restaurantTaxConfig?.isVatInclusive ?? brandTaxConfig.isVatInclusive ?? false,
                defaultVatRate: Number(restaurantTaxConfig?.defaultVatRate ?? brandTaxConfig.defaultVatRate ?? 0),
                applyServiceCharge: restaurantTaxConfig?.applyServiceCharge ?? brandTaxConfig.applyServiceCharge ?? false,
                serviceChargeRate: Number(restaurantTaxConfig?.serviceChargeRate ?? brandTaxConfig.serviceChargeRate ?? 0),
                source: restaurantTaxConfig ? 'RESTAURANT' : 'BRAND'
            };
        }
    } else if (restaurantTaxConfig) {
        effectiveTaxConfig = {
            isVatInclusive: restaurantTaxConfig.isVatInclusive || false,
            defaultVatRate: Number(restaurantTaxConfig.defaultVatRate) || 0,
            applyServiceCharge: restaurantTaxConfig.applyServiceCharge || false,
            serviceChargeRate: Number(restaurantTaxConfig.serviceChargeRate) || 0,
            source: 'RESTAURANT'
        };
    }

    return {
        table: {
            id: table.id,
            tableNumber: table.table_number,
            minCapacity: table.min_capacity,
            maxCapacity: table.max_capacity,
            status: table.status
        },
        restaurant: table.restaurant ? {
            id: table.restaurant.id,
            name: table.restaurant.name,
            logoUrl: table.restaurant.logo,
            bannerUrl: table.restaurant.imageMain,
            address: table.restaurant.address,
            brand: table.restaurant.brand ? {
                id: table.restaurant.brand.id,
                name: table.restaurant.brand.name,
                logoUrl: table.restaurant.brand.logo
            } : null
        } : null,
        taxConfig: effectiveTaxConfig,
        sessionStatus,
        guestInfo: activeReservation ? {
            name: activeReservation.guest_name || activeReservation.user?.name || "Quý khách",
            partySize: activeReservation.party_size,
            occasion: activeReservation.occasion,
            specialRequests: activeReservation.special_requests,
            confirmationCode: activeReservation.confirmation_code
        } : null,
        activeReservationId: activeReservation?.id || null,
        activeOrder: activeOrder ? {
            id: activeOrder.id,
            orderNumber: activeOrder.order_number,
            status: activeOrder.status,
            subtotal: activeOrder.subtotal,
            discountAmount: activeOrder.discount_amount,
            taxAmount: activeOrder.tax_amount,
            totalAmount: activeOrder.total_amount,
            items: activeOrder.items.map(item => ({
                id: item.id,
                menuItemId: item.menuItemId,
                name: item.name || item.menuItem?.name,
                price: item.unitPrice || item.menuItem?.base_price || 0,
                quantity: item.quantity,
                status: item.status,
                notes: item.note,
                imageUrl: item.menuItem?.image
            }))
        } : null
    };
};
