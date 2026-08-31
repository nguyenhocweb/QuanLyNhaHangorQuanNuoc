import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Tìm thông tin đặt bàn
 */
export const findReservationForOrderRepo = async (reservationId) => {
    return await prisma.reservations.findUnique({
        where: { id: reservationId },
        include: {
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    address: true
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
};

/**
 * Tạo mới hoặc thêm món vào đơn đặt bàn hiện tại
 */
export const createOrAppendDineInOrderRepo = async ({ reservation, items, addedSubtotal }) => {
    return await prisma.$transaction(async (tx) => {
        // Kiểm tra xem đã có Order đang mở cho reservation này chưa
        const existingOrder = await tx.order.findFirst({
            where: {
                reservationId: reservation.id,
                status: {
                    in: ['OPEN', 'SENT_TO_KITCHEN', 'PARTIALLY_SERVED', 'SERVED', 'BILL_REQUESTED']
                }
            }
        });

        const tableId = reservation.reservation_tables?.[0]?.tableId || null;

        if (existingOrder) {
            // Thêm các món mới vào đơn
            for (const item of items) {
                await tx.orderItem.create({
                    data: {
                        orderId: existingOrder.id,
                        menuItemId: item.menuItemId,
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        subtotal: item.unitPrice * item.quantity,
                        discountAmount: 0,
                        totalPrice: item.unitPrice * item.quantity,
                        note: item.note || null,
                        status: 'QUEUED',
                        isNew: true
                    }
                });
            }

            // Cập nhật lại tổng tiền Order
            return await tx.order.update({
                where: { id: existingOrder.id },
                data: {
                    subtotal: existingOrder.subtotal + addedSubtotal,
                    total_amount: existingOrder.total_amount + addedSubtotal,
                    status: 'SENT_TO_KITCHEN'
                },
                include: {
                    items: {
                        orderBy: { createdAt: 'desc' }
                    },
                    restaurant: {
                        select: { id: true, name: true, logo: true }
                    },
                    table: {
                        select: { id: true, table_number: true }
                    }
                }
            });
        }

        // Nếu chưa có đơn, tạo mới Order
        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        return await tx.order.create({
            data: {
                reservationId: reservation.id,
                restaurantId: reservation.restaurantId,
                tableId: tableId,
                order_number: orderNumber,
                status: 'SENT_TO_KITCHEN',
                subtotal: addedSubtotal,
                discount_amount: 0,
                tax_amount: 0,
                total_amount: addedSubtotal,
                items: {
                    create: items.map(item => ({
                        menuItemId: item.menuItemId,
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        subtotal: item.unitPrice * item.quantity,
                        discountAmount: 0,
                        totalPrice: item.unitPrice * item.quantity,
                        note: item.note || null,
                        status: 'QUEUED',
                        isNew: true
                    }))
                }
            },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' }
                },
                restaurant: {
                    select: { id: true, name: true, logo: true }
                },
                table: {
                    select: { id: true, table_number: true }
                }
            }
        });
    });
};
