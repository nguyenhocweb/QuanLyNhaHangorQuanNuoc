import { prisma } from "../../../../databases/init.mongodb.js";

export const createRestaurant = async (data) => {
    return prisma.restaurant.create({ data });
};
