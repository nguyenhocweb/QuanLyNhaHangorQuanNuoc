import { prisma } from "../../../../databases/init.mongodb.js";

export const updateRestaurantAmenitiesRepo = async (where, data) => {
    return await prisma.restaurant.update({
        where,
        data,
    });
};
