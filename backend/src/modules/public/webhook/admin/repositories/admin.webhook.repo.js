import { prisma } from "../../../../../databases/init.mongodb.js";

export const findTransactionByExternalId = async (externalTransactionId) => {
    return await prisma.brandSubscriptionTransaction.findFirst({
        where: { externalTransactionId: String(externalTransactionId) }
    });
};

export const updateTransactionStatus = async (transactionId, status) => {
    return await prisma.brandSubscriptionTransaction.update({
        where: { id: transactionId },
        data: { status }
    });
};

export const activateSubscription = async (subscriptionId) => {
    return await prisma.brandSubscription.update({
        where: { id: subscriptionId },
        data: { status: 'ACTIVE' }
    });
};
