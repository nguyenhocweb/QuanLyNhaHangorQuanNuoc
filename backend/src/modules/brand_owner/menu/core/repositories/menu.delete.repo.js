import { prisma } from "../../../../../databases/init.mongodb.js";

export const deleteMenuRepo = async (id) => {
    return prisma.menu.delete({
        where: { id }
    });
};
