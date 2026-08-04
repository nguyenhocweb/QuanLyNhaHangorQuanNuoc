import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy danh sách Hóa đơn (Invoices) của khách hàng
 * Lấy các đơn hàng đã thanh toán (PAID) kèm theo giao dịch và nhà hàng
 */
export const getMyInvoicesRepo = async (userId, pagination) => {
    const { skip, take } = pagination;

    const where = {
        reservation: {
            userId: userId
        },
        status: 'PAID'
    };

    const [total, invoices] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
            where,
            include: {
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        address: true
                    }
                },
                transactions: {
                    include: {
                        systemPaymentMethod: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                iconUrl: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
                items: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        unitPrice: true,
                        totalPrice: true
                    }
                }
            },
            orderBy: {
                paid_at: 'desc'
            },
            skip,
            take
        })
    ]);

    return { total, invoices };
};
