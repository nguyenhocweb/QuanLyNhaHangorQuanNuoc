import { prisma } from "../../../../databases/init.mongodb.js";

export const updatePromotionRepo = async (brandId, promotionId, data) => {
    return await prisma.promotion.update({
        where: {
            id: promotionId,
            brandId
        },
        data
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
