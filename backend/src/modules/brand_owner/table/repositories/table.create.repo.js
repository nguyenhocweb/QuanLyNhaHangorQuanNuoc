import { prisma } from "../../../../databases/init.mongodb.js";

export const createTableRepo = async (data) => {
    return await prisma.tables.create({
        data
    });
};
