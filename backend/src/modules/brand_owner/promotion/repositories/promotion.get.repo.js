import { prisma } from "../../../../databases/init.mongodb.js";

export const getPromotionsRepo = async (brandId, filter, skip, limit) => {
    const where = { brandId, ...filter };
    
    const [promotions, total] = await Promise.all([
        prisma.promotion.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                promotionRestaurants: {
                    include: {
                        restaurant: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        }),
        prisma.promotion.count({ where })
    ]);

    return { promotions, total };
};

export const getPromotionByIdRepo = async (brandId, promotionId) => {
    return await prisma.promotion.findFirst({
        where: {
            id: promotionId,
            brandId
        },
        include: {
            promotionRestaurants: {
                select: { restaurantId: true }
            },
            promotionMenuItems: {
                select: { menuItemId: true }
            }
        }
    });
};
