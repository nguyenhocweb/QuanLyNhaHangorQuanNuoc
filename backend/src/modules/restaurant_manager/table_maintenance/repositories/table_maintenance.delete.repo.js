import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteTableMaintenanceRepo = async (id) => {
    return await prisma.table_Maintenance_Schedules.delete({
        where: { id }
    });
};
