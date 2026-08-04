import { prisma } from "../../../../databases/init.mongodb.js";

export const updateRestaurantRepo = async (where, data) => {
    return await prisma.restaurant.update({
        where,
        data,
    });
};
