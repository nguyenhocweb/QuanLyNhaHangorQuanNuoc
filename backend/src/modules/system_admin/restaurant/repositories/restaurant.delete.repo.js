import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteRestaurant = async (id) => {
    return prisma.restaurant.delete({
        where: { id }
    });
};
