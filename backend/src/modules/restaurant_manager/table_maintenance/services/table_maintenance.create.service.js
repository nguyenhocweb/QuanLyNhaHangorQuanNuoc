import { prisma } from "../../../../databases/init.mongodb.js";
import { ConflictError, BadRequestError } from "../../../../core/constants/error/index.js";
import { createTableMaintenanceRepo } from "../repositories/table_maintenance.create.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";


export const createTableMaintenanceService = async (payload, user) => {
    const { restaurantId, tableIds, start_time, end_time, reason } = payload;

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (startDate >= endDate) {
        throw new BadRequestError("Thời gian kết thúc phải sau thời gian bắt đầu");
    }

    // Kiểm tra xem các bàn chọn có bị trùng lịch đặt bàn (Reservation) nào không
    const overlappingReservations = await prisma.reservations.findMany({
        where: {
            restaurantId,
            reservation_date: {
                gte: new Date(new Date(start_time).setHours(0,0,0,0)),
                lte: new Date(new Date(end_time).setHours(23,59,59,999))
            },
            status: {
                in: ["PENDING", "CONFIRMED", "SEATED"]
            },
            reservation_tables: {
                some: {
                    tableId: { in: tableIds }
                }
            }
        },
        include: {
            reservation_tables: {
                include: { table: true }
            }
        }
    });

    for (const res of overlappingReservations) {
        const affectedTables = res.reservation_tables
            .filter(rt => tableIds.includes(rt.tableId))
            .map(rt => rt.table?.table_number || rt.tableId);

            
        if (affectedTables.length > 0) {
            throw new ConflictError(`Bàn ${affectedTables.join(", ")} đã có lịch đặt của khách (${res.guest_name} - từ ${res.start_time} đến ${res.end_time} ngày ${new Date(res.reservation_date).toLocaleDateString("vi-VN")}). Vui lòng sắp xếp bàn khác trước khi lên lịch bảo trì!`);
        }
    }

    const result = await createTableMaintenanceRepo({
        restaurantId,
        tableIds,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        reason: reason || "Bảo trì định kỳ",
        status: "SCHEDULED",
        created_by_staff_id: user?.id || null
    });

    emitTableUpdate(restaurantId);

    return result;
};

