import { prisma } from "../../../../databases/init.mongodb.js";

export const updateRestaurantMenuRepo = async (restaurantId, menuItemId, data) => {
    const existing = await prisma.restaurantMenuItem.findFirst({
        where: {
            restaurantId,
            menuItemId
        }
    });

    if (existing) {
        return await prisma.restaurantMenuItem.update({
            where: {
                id: existing.id
            },
            data
        });
    } else {
        return await prisma.restaurantMenuItem.create({
            data: {
                restaurantId,
                menuItemId,
                ...data
            }
        });
    }
};
