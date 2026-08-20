import { prisma } from "../../../../databases/init.mongodb.js";

export const updateTagRepo = async (id, data) => {
    return prisma.tags.update({
        where: { id },
        data
    });
};