import { prisma } from "../../../../databases/init.mongodb.js";

export const checkSubscriptionInUse = async (id) => {
    return await prisma.brandSubscription.findFirst({
        where: { subscriptionPlanId: id }
    });
};

export const deleteSubscription = async (id) => {
    return await prisma.subscriptionPlan.delete({
        where: { id }
    });
};
