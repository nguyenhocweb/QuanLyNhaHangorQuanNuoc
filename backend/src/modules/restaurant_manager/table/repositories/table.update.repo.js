import { prisma } from "../../../../databases/init.mongodb.js";

export const updateTableRepo = async (id, data) => {
    return await prisma.tables.update({
        where: { id },
        data
    });
};
