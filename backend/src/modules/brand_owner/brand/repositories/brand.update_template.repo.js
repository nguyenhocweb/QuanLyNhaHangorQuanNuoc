import { prisma } from "../../../../databases/init.mongodb.js";

export const getTemplateByIdRepo = async (templateId) => {
    return prisma.template.findUnique({
        where: { id: templateId },
    });
};

export const getActiveSubscriptionByBrandRepo = async (brandId) => {
    return prisma.brandSubscription.findFirst({
        where: { brandId, status: "ACTIVE" },
        include: { plan: true },
    });
};

export const updateBrandTemplateRepo = async (brandId, templateId) => {
    return prisma.brand.update({
        where: { id: brandId },
        data: { templateId },
    });
};
