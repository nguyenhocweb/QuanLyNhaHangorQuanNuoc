import { getAreasAndTablesWithStatus } from "../repositories/table.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const getAreasWithTablesService = async (restaurantId) => {
    const areas = await getAreasAndTablesWithStatus(restaurantId);
    
    if (!areas) {
        throw new NotFoundError("Không tìm thấy dữ liệu khu vực");
    }

    const now = new Date();
    const activeMaintenances = await prisma.table_Maintenance_Schedules.findMany({
        where: {
            restaurantId,
            status: { in: ["SCHEDULED", "IN_PROGRESS"] },
            start_time: { lte: now },
            end_time: { gte: now }
        }
    });

    const activeMaintenanceTableIds = new Set();
    activeMaintenances.forEach(m => {
        (m.tableIds || []).forEach(tid => activeMaintenanceTableIds.add(tid));
    });

    const result = areas.map(area => ({
        id: area.id,
        name: area.name || `Tầng ${area.floor_number}`,
        smoking_allowed: area.smoking_allowed,
        is_outdoor: area.is_outdoor,
        floor_number: area.floor_number,
        width: area.width,
        height: area.height,
        background_url: area.background_url,
        obstacles: area.obstacles,
        tables: area.tabels.map(table => {
            let opStatus = "AVAILABLE";
            if (table.status === "MAINTENANCE" || activeMaintenanceTableIds.has(table.id)) {
                opStatus = "MAINTENANCE";
            }
            
            return {
                id: table.id,
                table_number: table.table_number,
                min_capacity: table.min_capacity,
                max_capacity: table.max_capacity,
                status: table.status,
                pos_x: table.pos_x,
                pos_y: table.pos_y,
                width: table.width,
                height: table.height,
                shape: table.shape,
                rotation: table.rotation,
                operational_status: opStatus
            };
        })
    }));

    return result;
};
