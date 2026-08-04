import { prisma } from "../../../../databases/init.mongodb.js";

export const updateAreaRepo = async (id, data) => {
    return await prisma.restaurant_Areas.update({
        where: { id },
        data
    });
};
