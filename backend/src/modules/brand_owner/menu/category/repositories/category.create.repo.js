import { prisma } from "../../../../../databases/init.mongodb.js";

export const createMenuCategoryRepo = async (brandId, menuIds, data) => {
    return prisma.menuCategory.create({
        data: {
            ...data,
            brandId,
            menuMaps: {
                create: menuIds.map(menuId => ({ menuId }))
            }
        },
        include: {
            menuMaps: { include: { menu: true } }
        }
    });
};
