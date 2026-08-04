import { updateReservationRepo } from "../repositories/reservation.update.repo.js";
import { getReservationByIdRepo } from "../repositories/reservation.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
import { emitReservationUpdate } from "../../../../core/utils/socket.js";

export const updateReservationService = async (id, restaurantId, staffId, data) => {
    const existing = await getReservationByIdRepo(id, restaurantId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn");
    }

    const result = await updateReservationRepo(id, restaurantId, staffId, data);
    emitReservationUpdate(restaurantId);
    return result;
};
