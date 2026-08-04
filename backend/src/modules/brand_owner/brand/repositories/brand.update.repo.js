import { prisma } from "../../../../databases/init.mongodb.js";

export const updateBrandById = async (brandId, payload) => {
    return await prisma.brand.update({
        where: { id: brandId },
        data: payload
    });
};
