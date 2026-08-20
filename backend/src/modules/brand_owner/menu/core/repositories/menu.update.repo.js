import { prisma } from "../../../../../databases/init.mongodb.js";

export const updateMenuRepo = async (id, data) => {
    return prisma.menu.update({
        where: { id },
        data
    });
};
