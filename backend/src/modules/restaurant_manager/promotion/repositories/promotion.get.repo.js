import { prisma } from "../../../../databases/init.mongodb.js";

export const getPromotionsRepo = async (filter = {}) => {
    return await prisma.promotion.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        include: {
            promotionRestaurants: true
        }
    });
};

export const getPromotionByIdRepo = async (id) => {
    return await prisma.promotion.findUnique({
        where: { id },
        include: {
            promotionRestaurants: true,
            promotionMenuItems: true
        }
    });
};
