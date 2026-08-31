import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy danh sách lịch sử đặt bàn của khách hàng
 * @param {string} userId - ID khách hàng
 * @param {object} filters - Bộ lọc (status)
 * @param {object} pagination - Phân trang (skip, take)
 */
export const getMyReservationsRepo = async (userId, filters, pagination) => {
    const { status } = filters;
    const { skip, take } = pagination;

    const where = {
        userId
    };

    if (status) {
        where.status = status;
    }

    const [total, reservations] = await Promise.all([
        prisma.reservations.count({ where }),
        prisma.reservations.findMany({
            where,
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        address: true,
                        phone_contact: true,
                        bookingConfig: {
                            select: {
                                cancellationHours: true
                            }
                        }
                    }
                },
                reservation_tables: {
                    include: {
                        table: {
                            select: {
                                table_number: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take
        })
    ]);

    return { total, reservations };
};

/**
 * Lấy chi tiết 1 đơn đặt bàn để kiểm tra quyền hủy
 */
export const getReservationByIdAndUserRepo = async (id, userId) => {
    return await prisma.reservations.findFirst({
        where: {
            id,
            userId
        },
        include: {
            restaurant: {
                select: {
                    bookingConfig: {
                        select: {
                            cancellationHours: true
                        }
                    }
                }
            }
        }
    });
};
