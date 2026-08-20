import { prisma } from "../../../../databases/init.mongodb.js";

export const createRestaurantRepo = async (data) => {
    return await prisma.$transaction(async (tx) => {
        const newRestaurant = await tx.restaurant.create({
            data,
        });

        if (data.brandId) {
            await tx.brand.update({
                where: { id: data.brandId },
                data: {
                    restaurantCount: {
                        increment: 1
                    }
                }
            });
        }

        return newRestaurant;
    });
};
