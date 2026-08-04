import { prisma } from "../../../../databases/init.mongodb.js";

export const deletePromotionRepo = async (brandId, promotionId) => {
    return await prisma.promotion.delete({
        where: {
            id: promotionId,
            brandId
        }
    });
};
