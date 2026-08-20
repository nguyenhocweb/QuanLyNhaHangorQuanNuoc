import { prisma } from "../../../../databases/init.mongodb.js";

export const updatePromotionRepo = async (brandId, promotionId, data) => {
    const { restaurantIds, menuItemIds, ...promotionData } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Update core promotion data
        const updatedPromotion = await tx.promotion.update({
            where: {
                id: promotionId,
                brandId
            },
            data: promotionData
        });

        // 2. Update Restaurants (delete all and recreate)
        if (restaurantIds !== undefined) {
            await tx.promotionRestaurant.deleteMany({
                where: { promotionId: promotionId }
            });

            if (restaurantIds.length > 0) {
                await tx.promotionRestaurant.createMany({
                    data: restaurantIds.map(resId => ({
                        promotionId: promotionId,
                        restaurantId: resId
                    }))
                });
            }
        }

        // 3. Update Menu Items (delete all and recreate)
        if (menuItemIds !== undefined) {
            await tx.promotionMenuItem.deleteMany({
                where: { promotionId: promotionId }
            });

            if (menuItemIds.length > 0) {
                await tx.promotionMenuItem.createMany({
                    data: menuItemIds.map(menuId => ({
                        promotionId: promotionId,
                        menuItemId: menuId
                    }))
                });
            }
        }

        return updatedPromotion;
    });
};

export const getPromotionByIdRepo = async (brandId, promotionId) => {
    return await prisma.promotion.findFirst({
        where: {
            id: promotionId,
            brandId
        }
    });
};
