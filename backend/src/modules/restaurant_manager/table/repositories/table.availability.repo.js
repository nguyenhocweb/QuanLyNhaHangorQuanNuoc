import { prisma } from "../../../../databases/init.mongodb.js";

export const getTableAvailabilityRepo = async (restaurantId, dateStr, startTime, endTime) => {
    // 1. Lấy tất cả areas và tables (kèm obstacles) của nhà hàng
    const areas = await prisma.restaurant_Areas.findMany({
        where: { restaurantId, is_active: "ACTIVE" },
        include: {
            tabels: {
                where: { status: "ACTIVE" }
            }
        }
    });

    // 2. Tìm tất cả các reservations bị trùng lặp thời gian
    // Điều kiện trùng: R_start < endTime AND R_end > startTime
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const overlappingReservations = await prisma.reservations.findMany({
        where: {
            restaurantId,
            reservation_date: {
                gte: targetDate,
                lt: nextDay
            },
            status: {
                in: ["PENDING", "CONFIRMED", "SEATED"] // Các trạng thái chiếm giữ bàn
            }
        },
        include: {
            reservation_tables: true
        }
    });

    const busyTableIds = new Set();
    
    overlappingReservations.forEach(res => {
        if (res.start_time < endTime && res.end_time > startTime) {
            res.reservation_tables.forEach(rt => busyTableIds.add(rt.tableId));
        }
    });

    // 2.5. Kiểm tra lịch bảo trì bàn (Table Maintenance Schedules) trong khung giờ này
    const maintenanceTableIds = new Set();
    const queryStartDateTime = new Date(`${dateStr}T${startTime}:00`);
    const queryEndDateTime = new Date(`${dateStr}T${endTime}:00`);

    if (!isNaN(queryStartDateTime.getTime()) && !isNaN(queryEndDateTime.getTime())) {
        const activeMaintenances = await prisma.table_Maintenance_Schedules.findMany({
            where: {
                restaurantId,
                status: { in: ["SCHEDULED", "IN_PROGRESS"] },
                start_time: { lt: queryEndDateTime },
                end_time: { gt: queryStartDateTime }
            }
        });
        activeMaintenances.forEach(m => {
            (m.tableIds || []).forEach(tid => maintenanceTableIds.add(tid));
        });
    }

    // 3. Đóng gói kết quả: gắn trạng thái bận/bảo trì cho các bàn bị trùng
    const areasWithStatus = areas.map(area => ({
        ...area,
        tables: area.tabels.map(table => {
            let status = "AVAILABLE";
            if (maintenanceTableIds.has(table.id)) {
                status = "MAINTENANCE";
            } else if (busyTableIds.has(table.id)) {
                status = "RESERVED";
            }
            return {
                ...table,
                operational_status: status
            };
        })
    }));

    areasWithStatus.forEach(area => delete area.tabels);

    return areasWithStatus;
};
