import { prisma } from "../../../../databases/init.mongodb.js";

export const deletePromotionRepo = async (id) => {
    return await prisma.promotion.delete({
        where: { id }
    });
};
