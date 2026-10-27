import { updateReservationRepo } from "../repositories/reservation.update.repo.js";
import { getReservationByIdRepo } from "../repositories/reservation.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
import { emitReservationUpdate } from "../../../../core/utils/socket.js";
import { notifyCustomerReservationChange } from "../utils/reservation.notification.js";

const formatDateVN = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export const updateReservationService = async (id, restaurantId, staffId, data) => {
    const existing = await getReservationByIdRepo(id, restaurantId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn");
    }

    const result = await updateReservationRepo(id, restaurantId, staffId, data);
    emitReservationUpdate(restaurantId);

    const resName = existing.restaurant?.name || "nhà hàng";
    const dateStr = formatDateVN(data.reservation_date || existing.reservation_date);
    const startTime = data.start_time || existing.start_time;
    const partySize = data.party_size || existing.party_size;

    notifyCustomerReservationChange({
        reservation: existing,
        title: "Cập nhật thông tin đặt bàn",
        body: `Đơn đặt bàn mã ${existing.confirmation_code} tại "${resName}" đã được cập nhật thông tin: Ngày ${dateStr}, lúc ${startTime}, ${partySize} khách.`,
        type: "RESERVATION"
    });

    return result;
};

