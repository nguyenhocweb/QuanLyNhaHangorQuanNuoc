import { prisma } from "../../../../databases/init.mongodb.js";

export const getDashboardBrandsRepo = async (limit) => {
    const brands = await prisma.brand.findMany({
        take: limit,
        select: {
            id: true,
            name: true,
            isActive: true,
            taxCode: true,
            createdAt: true,
            logo: true,
            isFeatured: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return brands;
};
