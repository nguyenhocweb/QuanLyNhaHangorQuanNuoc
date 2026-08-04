import { prisma } from "../../../../databases/init.mongodb.js";

export const createPromotionRepo = async (data) => {
    return await prisma.promotion.create({
        data
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
