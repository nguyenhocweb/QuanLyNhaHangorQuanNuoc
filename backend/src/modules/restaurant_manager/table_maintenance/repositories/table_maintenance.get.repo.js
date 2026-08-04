import { prisma } from "../../../../databases/init.mongodb.js";

export const getTableMaintenanceRepo = async (restaurantId, { skip, take, status, startDate, endDate }) => {
    const where = { restaurantId };

    if (status) {
        where.status = status;
    }

    if (startDate && endDate) {
        where.start_time = { lte: new Date(endDate) };
        where.end_time = { gte: new Date(startDate) };
    }

    const [items, total] = await Promise.all([
        prisma.table_Maintenance_Schedules.findMany({
            where,
            skip,
            take,
            orderBy: { start_time: "desc" },
            include: {
                tables: {
                    select: {
                        id: true,
                        table_number: true,
                        table_type: true
                    }
                }
            }
        }),
        prisma.table_Maintenance_Schedules.count({ where })
    ]);

    return { items, total };
};
