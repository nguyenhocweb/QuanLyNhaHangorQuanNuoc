import { assignTableRepo, unassignTableRepo } from "../repositories/reservation.assign.repo.js";
import { getReservationByIdRepo } from "../repositories/reservation.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { emitReservationUpdate, emitTableUpdate } from "../../../../core/utils/socket.js";

export const assignTableService = async (reservationId, restaurantId, tableId, staffId) => {
    const existingReservation = await getReservationByIdRepo(reservationId, restaurantId);
    if (!existingReservation) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn");
    }

    // Kiểm tra xem bàn có tồn tại trong nhà hàng không
    const table = await prisma.tables.findFirst({
        where: { id: tableId, restaurantId }
    });
    
    if (!table) {
        throw new NotFoundError("Bàn không tồn tại");
    }

    // Ở một hệ thống thực tế cần check xem khung giờ đó bàn này đã có ai gán chưa
    // Để giữ đơn giản cho MVP, ta chỉ gán.
    
    const result = await assignTableRepo(reservationId, tableId, staffId);
    emitReservationUpdate(restaurantId);
    emitTableUpdate(restaurantId);
    return result;
};

export const unassignTableService = async (reservationId, restaurantId, tableId) => {
    const result = await unassignTableRepo(reservationId, tableId);
    emitReservationUpdate(restaurantId);
    emitTableUpdate(restaurantId);
    return result;
};
