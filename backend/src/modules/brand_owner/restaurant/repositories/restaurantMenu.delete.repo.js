import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteRestaurantMenuRepo = async (restaurantId, menuItemId) => {
    // We try to delete the exact mapping.
    // If it doesn't exist, prisma will throw a RecordNotFound error, which is fine to catch or ignore.
    return await prisma.restaurantMenuItem.delete({
        where: {
            restaurantId_menuItemId: {
                restaurantId,
                menuItemId
            }
        }
    });
};
