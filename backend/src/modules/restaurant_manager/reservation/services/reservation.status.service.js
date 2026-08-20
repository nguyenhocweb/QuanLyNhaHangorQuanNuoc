import { updateReservationStatusRepo } from "../repositories/reservation.status.repo.js";
import { getReservationByIdRepo } from "../repositories/reservation.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
import { emitReservationUpdate, emitTableUpdate } from "../../../../core/utils/socket.js";

export const updateReservationStatusService = async (id, restaurantId, status, staffId, cancellation_reason) => {
    const existing = await getReservationByIdRepo(id, restaurantId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn");
    }

    const result = await updateReservationStatusRepo(id, restaurantId, status, staffId, cancellation_reason);
    emitReservationUpdate(restaurantId);
    emitTableUpdate(restaurantId);
    return result;
};
