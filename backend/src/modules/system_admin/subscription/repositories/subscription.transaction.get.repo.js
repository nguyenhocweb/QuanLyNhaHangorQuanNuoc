import { prisma } from "../../../../databases/init.mongodb.js";

export const getTransactionRepo = async (subscriptionId) => {
    return await prisma.brandSubscriptionTransaction.findFirst({
        where: { brandSubscriptionId: subscriptionId },
        include: {
            systemPaymentMethod: true
        }
    });
};
