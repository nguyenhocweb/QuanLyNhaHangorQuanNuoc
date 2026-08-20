import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteTemplateByIdRepo = async (id) => {
    return prisma.template.delete({
        where: { id },
    });
};

export const checkTemplateUsageRepo = async (id) => {
    // Kiểm tra xem có Brand hoặc Restaurant nào đang sử dụng template này không
    const brandCount = await prisma.brand.count({ where: { templateId: id } });
    const restaurantCount = await prisma.restaurant.count({ where: { templateId: id } });
    return { brandCount, restaurantCount };
};
