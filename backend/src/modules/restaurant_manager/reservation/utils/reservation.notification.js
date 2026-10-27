import { pushNotificationService } from "../../../shared/notifications/services/notification.push.service.js";
import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Gửi thông báo đến tài khoản khách hàng khi đơn đặt bàn được cập nhật/thay đổi trạng thái.
 */
export const notifyCustomerReservationChange = async ({ reservation, title, body, type = "RESERVATION" }) => {
    try {
        let targetUserId = reservation.userId;

        // Nếu đơn đặt chưa có userId liên kết trực tiếp, thử tra cứu User qua phone hoặc email
        if (!targetUserId && (reservation.guest_phone || reservation.guest_email)) {
            const conditions = [];
            if (reservation.guest_phone) conditions.push({ phone: reservation.guest_phone });
            if (reservation.guest_email) conditions.push({ email: reservation.guest_email });

            if (conditions.length > 0) {
                const user = await prisma.user.findFirst({
                    where: { OR: conditions },
                    select: { id: true }
                });
                targetUserId = user?.id || null;
            }
        }

        if (targetUserId) {
            await pushNotificationService.pushToCustomer({
                userIds: [targetUserId],
                title,
                body,
                type,
                referenceId: reservation.id,
                referenceType: "RESERVATION"
            });
        }
    } catch (err) {
        console.error("❌ Lỗi khi gửi thông báo đặt bàn cho khách hàng:", err);
    }
};
