import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteTagRepo = async (id) => {
    return prisma.tags.delete({ where: { id } });
};