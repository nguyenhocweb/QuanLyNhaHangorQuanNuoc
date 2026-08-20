import { prisma } from "../../../../databases/init.mongodb.js";

export const createSubscription = async (data) => {
    return await prisma.subscriptionPlan.create({ data });
};
