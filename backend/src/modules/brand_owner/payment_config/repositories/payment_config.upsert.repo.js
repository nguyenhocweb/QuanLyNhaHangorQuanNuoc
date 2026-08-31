import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Upsert cấu hình cổng thanh toán cho Brand
 */
export const upsertBrandPaymentConfigRepo = async ({ brandId, systemPaymentMethodId, configData, isActive, isTestMode }) => {
    return await prisma.brandPaymentConfig.upsert({
        where: {
            brandId_systemPaymentMethodId: {
                brandId,
                systemPaymentMethodId
            }
        },
        update: {
            configData,
            isActive,
            isTestMode,
            updatedAt: new Date()
        },
        create: {
            brandId,
            systemPaymentMethodId,
            configData,
            isActive: isActive ?? true,
            isTestMode: isTestMode ?? false
        },
        include: {
            systemPaymentMethod: true
        }
    });
};
