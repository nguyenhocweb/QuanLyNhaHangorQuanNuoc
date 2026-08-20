import { prisma } from "../../../../databases/init.mongodb.js";

export const getConfigByMethodId = async (systemPaymentMethodId) => {
    return await prisma.adminPaymentConfig.findUnique({
        where: { systemPaymentMethodId }
    });
};

export const upsertConfig = async (systemPaymentMethodId, configData, isActive) => {
    return await prisma.adminPaymentConfig.upsert({
        where: { systemPaymentMethodId },
        update: { configData, isActive },
        create: {
            systemPaymentMethodId,
            configData,
            isActive
        }
    });
};
