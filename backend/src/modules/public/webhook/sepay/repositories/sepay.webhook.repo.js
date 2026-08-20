import { prisma } from "../../../../../databases/init.mongodb.js";

export const findConfigByTokenHash = async (tokenHash) => {
    return await prisma.restaurantPaymentConfig.findFirst({
        where: {
            webhookTokenHash: tokenHash,
            isActive: true
        }
    });
};

export const checkTransactionExists = async (transactionId, systemPaymentMethodId) => {
    return await prisma.transaction.findUnique({
        where: {
            systemPaymentMethodId_externalTransactionId: {
                systemPaymentMethodId,
                externalTransactionId: transactionId
            }
        }
    });
};

export const createTransaction = async (data) => {
    return await prisma.transaction.create({
        data
    });
};

export const findOrderByOrderNumber = async (orderNumber) => {
    return await prisma.order.findUnique({
        where: { order_number: orderNumber }
    });
};

export const updateOrderStatus = async (orderId, status, paidAt, systemPaymentMethodId) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: { 
            status, 
            paid_at: paidAt,
            systemPaymentMethodId: systemPaymentMethodId
        }
    });
};
