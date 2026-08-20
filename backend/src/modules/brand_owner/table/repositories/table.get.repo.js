import { prisma } from "../../../../databases/init.mongodb.js";

export const getTablesByAreaIdRepo = async (areaId) => {
    return await prisma.tables.findMany({
        where: { areaId },
        orderBy: { table_number: 'asc' }
    });
};

export const getTableByIdRepo = async (id) => {
    return await prisma.tables.findUnique({
        where: { id }
    });
};

export const checkTableNumberExistsRepo = async (restaurantId, table_number) => {
    return await prisma.tables.findUnique({
        where: {
            restaurantId_table_number: {
                restaurantId,
                table_number
            }
        }
    });
};
