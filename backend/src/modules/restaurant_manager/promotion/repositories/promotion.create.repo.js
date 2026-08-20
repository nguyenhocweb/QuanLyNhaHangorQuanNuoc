import { prisma } from "../../../../databases/init.mongodb.js";

export const createPromotionRepo = async (data) => {
    const { menuItemIds, restaurantId, apply_restaurant_ids, targetAudience, ...promotionData } = data;
    const createData = { ...promotionData };
    
    // Map targetAudience to conditions JSON
    if (targetAudience) {
        createData.conditions = { targetAudience };
    }

    if (menuItemIds && menuItemIds.length > 0) {
        createData.promotionMenuItems = {
            create: menuItemIds.map(id => ({ menuItemId: id }))
        };
    }

    // Logic xử lý scope nhà hàng (Multi-tenant)
    const targetRestaurantIds = [];
    if (restaurantId) {
        targetRestaurantIds.push(restaurantId);
    } else if (apply_restaurant_ids && apply_restaurant_ids.length > 0) {
        targetRestaurantIds.push(...apply_restaurant_ids);
    }

    if (targetRestaurantIds.length > 0) {
        createData.promotionRestaurants = {
            create: targetRestaurantIds.map(id => ({ restaurantId: id }))
        };
    }

    return await prisma.promotion.create({
        data: createData
    });
};

export const findPromotionByCodeRepo = async (code) => {
    return await prisma.promotion.findUnique({
        where: { code }
    });
};
