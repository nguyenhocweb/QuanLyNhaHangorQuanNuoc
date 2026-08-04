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
                restaurant: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        }),
        prisma.promotion.count({ where })
    ]);

    return { promotions, total };
};
