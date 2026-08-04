import { prisma } from "../../../../../databases/init.mongodb.js";

export const updateCategoryRepo = async (id, menuIds, payload) => {
    const data = { ...payload };
    if (menuIds) {
        data.menuMaps = {
            deleteMany: {},
            create: menuIds.map(menuId => ({ menuId }))
        };
    }
    
    return prisma.menuCategory.update({
        where: { id },
        data,
        include: {
            menuMaps: { include: { menu: true } }
        }
    });
};
