import { prisma } from "../../../../databases/init.mongodb.js";

export const createAreaRepo = async (data) => {
    return await prisma.restaurant_Areas.create({
        data
    });
};
