import { prisma } from "../../../../databases/init.mongodb.js";

export const updateRestaurant = async (id, data) => {
    return prisma.restaurant.update({
        where: { id },
        data
    });
};
