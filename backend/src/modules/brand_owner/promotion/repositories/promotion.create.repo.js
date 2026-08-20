import { prisma } from "../../../../databases/init.mongodb.js";

export const createPromotionRepo = async (data) => {
    const { restaurantIds, menuItemIds, targetAudience, ...promotionData } = data;
    
    // Map targetAudience to conditions JSON
    const createData = { ...promotionData };
    if (targetAudience) {
        createData.conditions = { targetAudience };
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Tạo Promotion
        const promotion = await tx.promotion.create({
            data: createData
        });

        // 2. Tạo PromotionRestaurants
        if (restaurantIds && restaurantIds.length > 0) {
            await tx.promotionRestaurant.createMany({
                data: restaurantIds.map(resId => ({
                    promotionId: promotion.id,
                    restaurantId: resId
                }))
            });
        }

        // 3. Tạo PromotionMenuItems
        if (menuItemIds && menuItemIds.length > 0) {
            await tx.promotionMenuItem.createMany({
                data: menuItemIds.map(menuId => ({
                    promotionId: promotion.id,
                    menuItemId: menuId
                }))
            });
        }

        return promotion;
    });
};

export const checkCodeExistsRepo = async (code, brandId) => {
    return await prisma.promotion.findFirst({
        where: {
            code,
            brandId
        }
    });
};

export const checkRestaurantsBelongToBrandRepo = async (restaurantIds, brandId) => {
    const restaurants = await prisma.restaurant.findMany({
        where: {
            id: { in: restaurantIds },
            brandId
        },
        select: { id: true }
    });
    return restaurants.length === restaurantIds.length;
};

export const checkMenuItemsBelongToBrandRepo = async (menuItemIds, brandId) => {
    const menuItems = await prisma.menuItem.findMany({
        where: {
            id: { in: menuItemIds },
            brandId: brandId
        },
        select: { id: true }
    });
    return menuItems.length === menuItemIds.length;
};
