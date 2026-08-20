import { prisma } from "../../../../databases/init.mongodb.js";

export const updateRestaurantMenuRepo = async (restaurantId, menuItemId, data) => {
    // Upsert to handle cases where the menu item is added/updated for the first time
    // though normally Brand Owner assigns items to branches from Menu Management.
    // If it doesn't exist, we create it. If it exists, we update it.
    
    // First find if there's an existing mapping
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
