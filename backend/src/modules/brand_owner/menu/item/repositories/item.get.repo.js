import { prisma } from "../../../../../databases/init.mongodb.js";

export const getMenuItemsRepo = async (brandId, { skip, take, search, categoryId, menuId, restaurantId, isAvailable, isAssigned }) => {
    const categoryMapsCondition = {};
    if (categoryId) {
        categoryMapsCondition.categoryId = categoryId;
    }
    if (menuId) {
        categoryMapsCondition.category = {
            menuMaps: {
                some: {
                    menuId
                }
            }
        };
    }

    const where = {
        brandId,
        ...(Object.keys(categoryMapsCondition).length > 0 ? { categoryMaps: { some: categoryMapsCondition } } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {})
    };

    if (restaurantId) {
        if (isAssigned === 'true' || isAssigned === true) {
            where.restaurantMaps = {
                some: {
                    restaurantId,
                    ...(isAvailable !== undefined && isAvailable !== '' ? { isAvailable: isAvailable === 'true' || isAvailable === true } : {})
                }
            };
        } else if (isAssigned === 'false' || isAssigned === false) {
            where.restaurantMaps = {
                none: { restaurantId }
            };
        } else {
            if (isAvailable !== undefined && isAvailable !== '') {
                where.restaurantMaps = {
                    some: {
                        restaurantId,
                        isAvailable: isAvailable === 'true' || isAvailable === true
                    }
                };
            }
        }
    }

    const [data, total] = await Promise.all([
        prisma.menuItem.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: {
                categoryMaps: { 
                    include: { 
                        category: { 
                            include: {
                                menuMaps: {
                                    include: {
                                        menu: { select: { name: true } }
                                    }
                                }
                            }
                        } 
                    } 
                },
                variants: true,
                modifierGroups: {
                    include: { options: true }
                },
                restaurantMaps: restaurantId ? {
                    where: { restaurantId },
                    include: { restaurant: { select: { name: true } } }
                } : {
                    include: { restaurant: { select: { name: true } } }
                }
            }
        }),
        prisma.menuItem.count({ where })
    ]);

    return { data, total };
};
