import { prisma } from "../../../../../databases/init.mongodb.js";

export const deleteItemRepo = async (id) => {
    return prisma.menuItem.delete({
        where: { id }
    });
};
