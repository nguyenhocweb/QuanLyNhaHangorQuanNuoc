import { prisma } from "../../../databases/init.mongodb.js";
export const getBrands = async ({ where, page, limit }) => {
    const result = await prisma.brand.findMany({
        where: where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy:[
            {isFeatured:"desc"},
            {createdAt:"desc"}
        ],
        select: {
            id: true,
            name: true,
            description: true,
            imageMain: true,
            logo: true, // VD: "AS", "LA", "VI" trong vòng tròn
        }
    });
    return result ?? null
}