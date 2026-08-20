import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Hủy đơn đặt bàn của khách hàng
 * @param {string} id - ID đơn đặt bàn
 * @param {string} reason - Lý do hủy
 */
export const cancelReservationRepo = async (id, reason) => {
    return await prisma.reservations.update({
        where: { id },
        data: {
            status: "CANCELLED",
            cancellation_reason: reason,
            cancelled_at: new Date()
        }
    });
};
