import { prisma } from "../../../../databases/init.mongodb.js";

export const getBrandSubscriptionByBrandId = async (brandId) => {
    const subscription = await prisma.brandSubscription.findFirst({
        where: { 
            brandId,
            status: 'ACTIVE',
            endDate: {
                gte: new Date()
            }
        },
        include: {
            plan: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return subscription;
};
