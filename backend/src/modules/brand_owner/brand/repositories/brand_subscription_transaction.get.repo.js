import { prisma } from "../../../../databases/init.mongodb.js";

export const getTransactionById = async (transactionId) => {
    return await prisma.brandSubscriptionTransaction.findUnique({
        where: { id: transactionId },
        include: {
            brandSubscription: true
        }
    });
};
