import { prisma } from "../../../../databases/init.mongodb.js";

export const getRestaurantMenuRepo = async (restaurantId, { skip = 0, take = 50, search, categoryId, menuId, isAvailable }) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { brandId: true }
    });
    const brandId = restaurant?.brandId;

    const where = {
        restaurantMaps: {
            some: {
                restaurantId,
                ...(isAvailable !== undefined && isAvailable !== '' ? { isAvailable: isAvailable === 'true' || isAvailable === true } : {})
            }
        },
        ...(categoryId ? { categoryMaps: { some: { categoryId } } } : {}),
        ...(menuId ? { categoryMaps: { some: { category: { menuMaps: { some: { menuId } } } } } } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {})
    };

    const [data, total, categories, menus] = await Promise.all([
        prisma.menuItem.findMany({
            where,
            skip: Number(skip),
            take: Number(take),
            orderBy: { createdAt: "desc" },
            include: {
                categoryMaps: {
                    include: {
                        category: {
                            include: {
                                menuMaps: {
                                    include: {
                                        menu: { select: { id: true, name: true } }
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
                restaurantMaps: {
                    where: { restaurantId }
                }
            }
        }),
        prisma.menuItem.count({ where }),
        brandId ? prisma.menuCategory.findMany({
            where: { brandId, is_active: true },
            select: { id: true, name: true, menuMaps: { select: { menuId: true } } },
            orderBy: { sort_order: "asc" }
        }) : Promise.resolve([]),
        brandId ? prisma.menu.findMany({
            where: { brandId, is_active: true },
            select: { id: true, name: true },
            orderBy: { sort_order: "asc" }
        }) : Promise.resolve([])
    ]);

    // Format output so restaurantMenuItem details are easily accessible
    const formattedData = data.map(item => {
        const restaurantMenu = item.restaurantMaps?.[0] || {};
        return {
            ...item,
            isAvailable: restaurantMenu.isAvailable ?? true,
            overridePrice: restaurantMenu.overridePrice ?? null,
            restaurantMenuItemId: restaurantMenu.id || null
        };
    });

    return { data: formattedData, total, categories, menus };
};
