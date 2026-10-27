import { updateReservationStatusRepo } from "../repositories/reservation.status.repo.js";
import { getReservationByIdRepo } from "../repositories/reservation.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
import { emitReservationUpdate, emitTableUpdate } from "../../../../core/utils/socket.js";
import { notifyCustomerReservationChange } from "../utils/reservation.notification.js";

const formatDateVN = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export const updateReservationStatusService = async (id, restaurantId, status, staffId, cancellation_reason) => {
    const existing = await getReservationByIdRepo(id, restaurantId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn");
    }

    const result = await updateReservationStatusRepo(id, restaurantId, status, staffId, cancellation_reason);
    emitReservationUpdate(restaurantId);
    emitTableUpdate(restaurantId);

    // Gửi thông báo đến khách hàng
    const resName = existing.restaurant?.name || "nhà hàng";
    const dateStr = formatDateVN(existing.reservation_date);
    const code = existing.confirmation_code;

    let notifTitle = "";
    let notifBody = "";
    let notifType = "RESERVATION";

    if (status === "CONFIRMED") {
        notifTitle = "Đơn đặt bàn đã được xác nhận! 🎉";
        notifBody = `Đơn đặt bàn của bạn tại "${resName}" vào lúc ${existing.start_time} ngày ${dateStr} đã được xác nhận thành công (Mã: ${code}).`;
        notifType = "CONFIRMATION";
    } else if (status === "CANCELLED") {
        notifTitle = "Đơn đặt bàn đã bị hủy";
        notifBody = `Đơn đặt bàn mã ${code} tại "${resName}" đã bị hủy.${cancellation_reason ? ` Lý do: ${cancellation_reason}` : ""}`;
        notifType = "CANCELLATION";
    } else if (status === "SEATED") {
        notifTitle = "Nhận bàn thành công";
        notifBody = `Chào mừng quý khách đã đến "${resName}". Chúc bạn có một bữa ăn ngon miệng và trải nghiệm vui vẻ!`;
        notifType = "RESERVATION";
    } else if (status === "COMPLETED") {
        notifTitle = "Cảm ơn quý khách đã dùng bữa!";
        notifBody = `Cảm ơn bạn đã trải nghiệm tại "${resName}". Hãy để lại đánh giá để giúp nhà hàng hoàn thiện hơn nhé!`;
        notifType = "RESERVATION";
    } else if (status === "NO_SHOW") {
        notifTitle = "Đơn đặt bàn đã quá hạn";
        notifBody = `Đơn đặt bàn mã ${code} tại "${resName}" đã được chuyển sang trạng thái vắng mặt do quá giờ hẹn.`;
        notifType = "RESERVATION";
    } else {
        notifTitle = "Cập nhật trạng thái đặt bàn";
        notifBody = `Đơn đặt bàn mã ${code} tại "${resName}" đã được cập nhật trạng thái mới.`;
        notifType = "RESERVATION";
    }

    notifyCustomerReservationChange({
        reservation: existing,
        title: notifTitle,
        body: notifBody,
        type: notifType
    });

    return result;
};

