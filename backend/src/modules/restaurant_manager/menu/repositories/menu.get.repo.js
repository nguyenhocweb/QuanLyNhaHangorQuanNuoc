import { prisma } from "../../../../databases/init.mongodb.js";

export const getRestaurantMenuRepo = async (restaurantId, { skip = 0, take = 50, search, categoryId, menuId, isAvailable }) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { brandId: true }
    });
    const brandId = restaurant?.brandId;

    const where = {
        OR: [
            { restaurantId },
            ...(brandId ? [{ brandId }] : []),
            { restaurantMenuItems: { some: { restaurantId } } }
        ],
        ...(categoryId ? {
            OR: [
                { categoryId },
                { itemCategoryMaps: { some: { categoryId } } }
            ]
        } : {}),
        ...(menuId ? {
            OR: [
                { category: { menuId } },
                { category: { menuCategoryMaps: { some: { menuId } } } }
            ]
        } : {}),
        ...(isAvailable !== undefined && isAvailable !== '' ? {
            restaurantMenuItems: {
                some: {
                    restaurantId,
                    isAvailable: isAvailable === 'true' || isAvailable === true
                }
            }
        } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {})
    };

    const [data, total, categories, menus] = await Promise.all([
        prisma.menuItem.findMany({
            where,
            skip: Number(skip),
            take: Number(take),
            orderBy: { createdAt: "desc" },
            include: {
                category: {
                    include: {
                        menu: { select: { id: true, name: true } },
                        menuCategoryMaps: {
                            include: {
                                menu: { select: { id: true, name: true } }
                            }
                        }
                    }
                },
                itemCategoryMaps: {
                    include: {
                        category: {
                            include: {
                                menu: { select: { id: true, name: true } },
                                menuCategoryMaps: {
                                    include: {
                                        menu: { select: { id: true, name: true } }
                                    }
                                }
                            }
                        }
                    }
                },
                itemVariants: true,
                modifierGroups: {
                    include: { options: true }
                },
                restaurantMenuItems: {
                    where: { restaurantId }
                }
            }
        }),
        prisma.menuItem.count({ where }),
        prisma.menuCategory.findMany({
            where: {
                OR: [
                    { menu: { restaurantId } },
                    ...(brandId ? [{ menu: { brandId } }] : []),
                    { menuCategoryMaps: { some: { menu: { restaurantId } } } },
                    ...(brandId ? [{ menuCategoryMaps: { some: { menu: { brandId } } } }] : [])
                ],
                is_active: true
            },
            select: {
                id: true,
                name: true,
                menuId: true,
                menuCategoryMaps: {
                    select: { menuId: true }
                }
            },
            orderBy: { sort_order: "asc" }
        }),
        prisma.menu.findMany({
            where: {
                OR: [
                    { restaurantId },
                    ...(brandId ? [{ brandId }] : [])
                ],
                is_active: true
            },
            select: { id: true, name: true },
            orderBy: { sort_order: "asc" }
        })
    ]);

    // Format output so frontend receives the exact shape it expects
    const formattedData = data.map(item => {
        const restaurantMenu = item.restaurantMenuItems?.[0] || {};
        
        // Map categoryMaps so frontend can read categories & menus
        const catList = [];
        if (item.category) {
            const menuMaps = [];
            if (item.category.menu) {
                menuMaps.push({ menu: item.category.menu });
            }
            if (item.category.menuCategoryMaps) {
                item.category.menuCategoryMaps.forEach(m => {
                    if (m.menu && !menuMaps.some(x => x.menu?.id === m.menu.id)) {
                        menuMaps.push({ menu: m.menu });
                    }
                });
            }
            catList.push({
                category: {
                    id: item.category.id,
                    name: item.category.name,
                    menuMaps
                }
            });
        }
        if (item.itemCategoryMaps) {
            item.itemCategoryMaps.forEach(icm => {
                if (icm.category && !catList.some(c => c.category?.id === icm.category.id)) {
                    const menuMaps = [];
                    if (icm.category.menu) menuMaps.push({ menu: icm.category.menu });
                    if (icm.category.menuCategoryMaps) {
                        icm.category.menuCategoryMaps.forEach(m => {
                            if (m.menu && !menuMaps.some(x => x.menu?.id === m.menu.id)) {
                                menuMaps.push({ menu: m.menu });
                            }
                        });
                    }
                    catList.push({
                        category: {
                            id: icm.category.id,
                            name: icm.category.name,
                            menuMaps
                        }
                    });
                }
            });
        }

        return {
            ...item,
            basePrice: item.base_price,
            isAvailable: restaurantMenu.isAvailable ?? item.is_available ?? true,
            overridePrice: restaurantMenu.overridePrice ?? null,
            restaurantMenuItemId: restaurantMenu.id || null,
            categoryMaps: catList,
            variants: item.itemVariants || []
        };
    });

    const formattedCategories = categories.map(cat => {
        const menuMaps = [];
        if (cat.menuId) menuMaps.push({ menuId: cat.menuId });
        if (cat.menuCategoryMaps) {
            cat.menuCategoryMaps.forEach(m => {
                if (!menuMaps.some(x => x.menuId === m.menuId)) {
                    menuMaps.push({ menuId: m.menuId });
                }
            });
        }
        return {
            id: cat.id,
            name: cat.name,
            menuMaps
        };
    });

    return { data: formattedData, total, categories: formattedCategories, menus };
};
