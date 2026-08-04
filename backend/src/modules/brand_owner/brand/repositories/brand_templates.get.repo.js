import { prisma } from "../../../../databases/init.mongodb.js";

export const getAllActiveTemplatesRepo = async () => {
    return prisma.template.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });
};

export const getActiveSubscriptionByBrandRepo = async (brandId) => {
    return prisma.brandSubscription.findFirst({
        where: { brandId, status: "ACTIVE" },
        include: { plan: true },
    });
};
