import { getReservationByIdAndUserRepo } from "../reservation.repository/reservation.get.repo.js";
import { cancelReservationRepo as cancelRepoUpdate } from "../reservation.repository/reservation.update.repo.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const cancelReservationService = async (id, userId, reason) => {
    const reservation = await getReservationByIdAndUserRepo(id, userId);

    if (!reservation) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn này.");
    }

    if (reservation.status === 'CANCELLED') {
        throw new BadRequestError("Đơn đặt bàn này đã bị hủy trước đó.");
    }

    if (reservation.status === 'COMPLETED' || reservation.status === 'SEATED') {
        throw new BadRequestError("Không thể hủy đơn đặt bàn đã hoàn thành hoặc khách đã đến.");
    }

    // Kiểm tra quy định hủy bàn của nhà hàng (cancellation_hours)
    const cancellationHours = reservation.restaurant?.cancellation_hours || 0;
    
    if (cancellationHours > 0 && reservation.reservation_date && reservation.start_time) {
        // Kết hợp reservation_date và start_time
        const dateObj = new Date(reservation.reservation_date);
        const [hours, minutes] = reservation.start_time.split(':');
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const now = new Date();
        const diffInHours = (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffInHours < cancellationHours) {
            throw new BadRequestError(`Nhà hàng yêu cầu hủy bàn trước ${cancellationHours} tiếng. Hiện tại đã quá thời hạn cho phép hủy.`);
        }
    }

    // Thực hiện hủy bàn
    const updatedReservation = await cancelRepoUpdate(id, reason);

    // Ghi log vào hệ thống
    await prisma.reservation_Audit_Log.create({
        data: {
            reservationId: id,
            changedByUserId: userId,
            action: "CANCELLED_BY_CUSTOMER",
            old_values: { status: reservation.status },
            new_values: { status: "CANCELLED", cancellation_reason: reason }
        }
    });

    return updatedReservation;
};
