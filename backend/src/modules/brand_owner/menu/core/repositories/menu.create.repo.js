import { prisma } from "../../../../../databases/init.mongodb.js";

export const createMenuRepo = async (brandId, data) => {
    return prisma.menu.create({
        data: {
            ...data,
            brandId
        }
    });
};
