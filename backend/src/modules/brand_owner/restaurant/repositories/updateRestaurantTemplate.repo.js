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

export const updateRestaurantTemplateRepo = async (brandId, templateId, restaurantIds = null) => {
    if (restaurantIds && restaurantIds.length > 0) {
        return prisma.restaurant.updateMany({
            where: { id: { in: restaurantIds }, brandId: brandId },
            data: { templateId: templateId },
        });
    }
    return prisma.restaurant.updateMany({
        where: { brandId: brandId },
        data: { templateId: templateId },
    });
};
