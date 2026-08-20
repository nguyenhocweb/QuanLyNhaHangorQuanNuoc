import { prisma } from "../../../../databases/init.mongodb.js";

export const updateSubscription = async (id, data) => {
    return await prisma.subscriptionPlan.update({
        where: { id },
        data
    });
};
