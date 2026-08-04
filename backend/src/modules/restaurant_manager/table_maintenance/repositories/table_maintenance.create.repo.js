import { prisma } from "../../../../databases/init.mongodb.js";

export const createTableMaintenanceRepo = async (data) => {
    return await prisma.table_Maintenance_Schedules.create({
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
