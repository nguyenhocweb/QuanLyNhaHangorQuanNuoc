import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy thông tin đơn hàng đang hoạt động và danh sách món theo mã đặt bàn
 */
export const getActiveOrderByReservationRepo = async (reservationId) => {
    const reservation = await prisma.reservations.findUnique({
        where: { id: reservationId },
        include: {
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    address: true,
                    taxConfig: true,
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            taxConfig: true,
                            brandPaymentConfigs: {
                                where: { isActive: true },
                                include: {
                                    systemPaymentMethod: true
                                }
                            }
                        }
                    }
                }
            },
            reservation_tables: {
                include: {
                    table: {
                        select: {
                            id: true,
                            table_number: true,
                            min_capacity: true,
                            max_capacity: true,
                            area: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!reservation) return null;

    const activeOrder = await prisma.order.findFirst({
        where: {
            reservationId: reservation.id,
            status: {
                notIn: ['CANCELLED']
            }
        },
        include: {
            items: {
                orderBy: { createdAt: 'desc' },
                include: {
                    menuItem: {
                        select: {
                            image: true,
                            description: true
                        }
                    }
                }
            },
            table: {
                select: {
                    id: true,
                    table_number: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        reservation,
        order: activeOrder
    };
};
