import { prisma } from "../../../../databases/init.mongodb.js";

export const getAvailableTablesRepo = async (restaurantId, { date, startTime, endTime, partySize }) => {
    // 1. Lấy tất cả các KHU VỰC (Areas) kèm theo Bàn (Tables) đang hoạt động
    const areas = await prisma.restaurant_Areas.findMany({
        where: {
            restaurantId,
            is_active: "ACTIVE"
        },
        include: {
            tabels: {
                where: {
                    status: "ACTIVE"
                },
                orderBy: {
                    table_number: 'asc'
                }
            }
        },
        orderBy: {
            floor_number: 'asc'
        }
    });

    if (areas.length === 0) return [];

    // Gôm tất cả tableIds để query bảng đặt chỗ
    const tableIds = areas.flatMap(area => area.tabels.map(t => t.id));

    if (tableIds.length === 0) return areas; // Không có bàn nào thì trả về sơ đồ rỗng

    // Convert startTime and endTime (e.g. "20:30") into proper Date objects
    const targetDate = new Date(date);
    
    const [startH, startM] = startTime.split(':').map(Number);
    const startDateTime = new Date(targetDate);
    startDateTime.setHours(startH, startM, 0, 0);

    const [endH, endM] = endTime.split(':').map(Number);
    const endDateTime = new Date(targetDate);
    endDateTime.setHours(endH, endM, 0, 0);

    // 2. Tìm các Lịch bảo trì đè giờ
    const maintenanceRecords = await prisma.table_Maintenance_Schedules.findMany({
        where: {
            restaurantId,
            start_time: { lt: endDateTime },
            end_time: { gt: startDateTime },
            status: { in: ["SCHEDULED", "IN_PROGRESS"] }
        },
        select: {
            tableIds: true
        }
    });

    const maintenanceTableIds = new Set();
    maintenanceRecords.forEach(record => {
        record.tableIds.forEach(id => maintenanceTableIds.add(id));
    });

    // 3. Tìm các Reservations TRONG ngày đó đã được xếp bàn và có nguy cơ đè giờ
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const occupiedTableRecords = await prisma.reservation_Tables.findMany({
        where: {
            tableId: { in: tableIds },
            reservation: {
                reservation_date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    in: ["PENDING", "CONFIRMED", "SEATED"]
                },
                start_time: { lt: endTime },
                end_time: { gt: startTime }
            }
        },
        select: {
            tableId: true,
            reservation: {
                select: {
                    status: true
                }
            }
        }
    });

    const occupiedTablesMap = new Map();
    occupiedTableRecords.forEach(record => {
        const currentResStatus = occupiedTablesMap.get(record.tableId);
        const newResStatus = record.reservation.status;
        // Ưu tiên SEATED > CONFIRMED/PENDING
        if (!currentResStatus || newResStatus === 'SEATED') {
            occupiedTablesMap.set(record.tableId, newResStatus);
        }
    });

    // 3. Phân loại Available và Unavailable, lồng ghép vào Areas
    const results = areas.map(area => {
        // Parse obstacles nếu có
        let parsedObstacles = [];
        if (area.obstacles) {
            try {
                // Prisma Json is usually parsed already if valid, but just in case
                parsedObstacles = typeof area.obstacles === 'string' ? JSON.parse(area.obstacles) : area.obstacles;
            } catch (e) {
                parsedObstacles = [];
            }
        }

        return {
            id: area.id,
            name: area.name,
            floor_number: area.floor_number,
            width: area.width || 1200,
            height: area.height || 800,
            obstacles: parsedObstacles,
            tables: area.tabels.map(table => {
                let current_status = 'AVAILABLE';
                let unavailability_reason = null;
                if (table.status === 'MAINTENANCE' || maintenanceTableIds.has(table.id)) {
                    current_status = 'MAINTENANCE';
                    unavailability_reason = "Đang bảo trì";
                } else if (occupiedTablesMap.has(table.id)) {
                    const resStatus = occupiedTablesMap.get(table.id);
                    if (resStatus === 'SEATED') {
                        current_status = 'SEATED';
                        unavailability_reason = "Đang phục vụ";
                    } else {
                        current_status = 'RESERVED';
                        unavailability_reason = "Đã được đặt";
                    }
                } else if (table.status === 'CLEANING') {
                    current_status = 'CLEANING';
                    unavailability_reason = "Đang chờ dọn dẹp";
                }
                
                return {
                    ...table,
                    current_status,
                    is_available: current_status === 'AVAILABLE',
                    unavailability_reason
                };
            })
        };
    });

    return results;
};
