import { prisma } from "../../../../databases/init.mongodb.js";

export const getBrandSubscriptionLimitRepo = async (brandId) => {
    return await prisma.brand.findUnique({
        where: { id: brandId },
        select: {
            restaurantCount: true,
            subscriptions: {
                where: {
                    status: 'ACTIVE',
                    endDate: {
                        gte: new Date()
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    plan: {
                        select: {
                            maxRestaurants: true
                        }
                    }
                }
            }
        }
    });
};
