import { createReservationRepo } from "../repositories/reservation.create.repo.js";
import { ConflictError } from "../../../../core/constants/error/index.js";
import { emitReservationUpdate } from "../../../../core/utils/socket.js";

export const createReservationService = async (restaurantId, staffId, data) => {
    // Có thể thêm check logic: vd ko cho đặt giờ trong quá khứ
    const reservationDate = new Date(data.reservation_date);
    const now = new Date();
    
    // So sánh ngày (bỏ qua giờ)
    reservationDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if (reservationDate < now) {
        throw new ConflictError("Không thể đặt bàn cho ngày trong quá khứ.");
    }

    const result = await createReservationRepo(restaurantId, staffId, data);
    emitReservationUpdate(restaurantId);
    return result;
};
