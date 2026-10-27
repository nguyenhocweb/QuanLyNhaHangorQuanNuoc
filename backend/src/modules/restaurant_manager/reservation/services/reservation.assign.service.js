import { assignTableRepo, unassignTableRepo } from "../repositories/reservation.assign.repo.js";
import { getReservationByIdRepo } from "../repositories/reservation.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { emitReservationUpdate, emitTableUpdate } from "../../../../core/utils/socket.js";
import { notifyCustomerReservationChange } from "../utils/reservation.notification.js";

export const assignTableService = async (reservationId, restaurantId, tableId, staffId) => {
    const existingReservation = await getReservationByIdRepo(reservationId, restaurantId);
    if (!existingReservation) {
        throw new NotFoundError("Không tìm thấy đơn đặt bàn");
    }

    // Kiểm tra xem bàn có tồn tại trong nhà hàng không
    const table = await prisma.tables.findFirst({
        where: { id: tableId, restaurantId },
        include: { area: true }
    });
    
    if (!table) {
        throw new NotFoundError("Bàn không tồn tại");
    }
    
    const result = await assignTableRepo(reservationId, tableId, staffId);
    emitReservationUpdate(restaurantId);
    emitTableUpdate(restaurantId);

    const resName = existingReservation.restaurant?.name || "nhà hàng";
    const tableName = table.name || `Bàn #${table.table_number}`;
    const areaName = table.area?.name ? ` (${table.area.name})` : "";

    notifyCustomerReservationChange({
        reservation: existingReservation,
        title: "Đã xếp bàn cho đơn đặt của bạn",
        body: `Đơn đặt bàn mã ${existingReservation.confirmation_code} tại "${resName}" đã được xếp vào ${tableName}${areaName}.`,
        type: "RESERVATION"
    });

    return result;
};

export const unassignTableService = async (reservationId, restaurantId, tableId) => {
    const result = await unassignTableRepo(reservationId, tableId);
    emitReservationUpdate(restaurantId);
    emitTableUpdate(restaurantId);
    return result;
};

