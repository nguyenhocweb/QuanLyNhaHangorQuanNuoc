import { prisma } from "../../../../databases/init.mongodb.js";

export const findEmploymentByUserId = async (userId) => {
    return await prisma.employment.findFirst({
        where: { userId },
        include: { brand: true }
    });
};

export const getBrandById = async (brandId) => {
    return await prisma.brand.findUnique({
        where: { id: brandId },
        include: {
            employments: true,
            _count: {
                select: {
                    employments: true,
                    restaurants: true
                }
            }
        }
    });
};
