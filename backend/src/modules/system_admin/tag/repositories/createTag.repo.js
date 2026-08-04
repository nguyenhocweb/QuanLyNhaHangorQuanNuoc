import { prisma } from "../../../../databases/init.mongodb.js";

export const createTagRepo = async (data) => {
    return prisma.tags.create({ data });
};