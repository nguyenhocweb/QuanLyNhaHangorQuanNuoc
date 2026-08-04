import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy danh sách Đơn hàng của khách hàng (thông qua reservation)
 * @param {string} userId - ID khách hàng
 * @param {object} filters - Bộ lọc (status)
 * @param {object} pagination - Phân trang (skip, take)
 */
export const getMyOrdersRepo = async (userId, filters, pagination) => {
    const { status } = filters;
    const { skip, take } = pagination;

    const where = {
        reservation: {
            userId: userId
        }
    };

    if (status) {
        where.status = status;
    }

    const [total, orders] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
            where,
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                },
                items: {
                    take: 3, // Lấy trước 3 item để hiển thị ngoài Card
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        totalPrice: true
                    }
                },
                _count: {
                    select: { items: true } // Tổng số món ăn
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take
        })
    ]);

    return { total, orders };
};
