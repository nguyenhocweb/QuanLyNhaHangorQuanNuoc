import { prisma } from "../../../../databases/init.mongodb.js";

export const getSubscriptionPlans = async () => {
    return await prisma.subscriptionPlan.findMany({
        orderBy: { price: 'asc' }
    });
};
