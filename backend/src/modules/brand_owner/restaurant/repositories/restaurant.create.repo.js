import { prisma } from "../../../../databases/init.mongodb.js";

export const createRestaurantRepo = async (data) => {
    return await prisma.$transaction(async (tx) => {
        const newRestaurant = await tx.restaurant.create({
            data,
        });

        return newRestaurant;
    });
};
