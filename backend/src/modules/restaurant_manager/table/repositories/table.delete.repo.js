import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteTableRepo = async (id) => {
    return await prisma.tables.delete({
        where: { id }
    });
};
