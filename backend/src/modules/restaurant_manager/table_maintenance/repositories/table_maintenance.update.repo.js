import { prisma } from "../../../../databases/init.mongodb.js";

export const updateTableMaintenanceRepo = async (id, data) => {
    return await prisma.table_Maintenance_Schedules.update({
        where: { id },
        data,
        include: {
            tables: {
                select: {
                    id: true,
                    table_number: true,
                    table_type: true
                }
            }
        }
    });
};
