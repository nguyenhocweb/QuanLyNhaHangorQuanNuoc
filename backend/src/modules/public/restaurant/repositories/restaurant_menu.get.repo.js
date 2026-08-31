import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getPublicRestaurantMenuRepo = async (restaurantId) => {
    // 1. Lấy thông tin nhà hàng để biết brandId
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { brandId: true }
    });

    if (!restaurant) {
        throw new NotFoundError("Không tìm thấy thông tin nhà hàng");
    }

    // 2. Lấy menu đang active của nhà hàng HOẶC của thương hiệu
    const activeMenus = await prisma.menu.findMany({
        where: {
            OR: [
                { restaurantId: restaurantId },
                ...(restaurant.brandId ? [{ brandId: restaurant.brandId }] : [])
            ],
            is_active: true
        },
        orderBy: {
            sort_order: 'asc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            type: true,
            available_days: true,
            available_from: true,
            available_until: true,
            menucategory: {
                where: {
                    is_active: true
                },
                orderBy: {
                    sort_order: 'asc'
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image_url: true,
                    items: {
                        where: {
                            is_available: true
                        },
                        orderBy: {
                            sort_order: 'asc'
                        },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            image: true,
                            images: true,
                            base_price: true,
                            discount_percent: true,
                            is_featured: true,
                            allergens: true,
                            spice_level: true,
                            prep_time: true,
                            itemVariants: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true
                                }
                            },
                            modifierGroups: {
                                select: {
                                    id: true,
                                    name: true,
                                    minSelections: true,
                                    maxSelections: true,
                                    options: {
                                        select: {
                                            id: true,
                                            name: true,
                                            priceExtra: true
                                        }
                                    }
                                }
                            },
                            restaurantMenuItems: {
                                where: {
                                    restaurantId: restaurantId
                                },
                                select: {
                                    overridePrice: true,
                                    isAvailable: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Format & map to user-friendly structure
    return activeMenus.map(menu => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        type: menu.type,
        available_days: menu.available_days,
        available_from: menu.available_from,
        available_until: menu.available_until,
        categories: (menu.menucategory || []).map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            image_url: cat.image_url,
            items: (cat.items || []).map(item => {
                const restOverride = item.restaurantMenuItems?.[0];
                const finalPrice = (restOverride && restOverride.overridePrice !== null)
                    ? restOverride.overridePrice
                    : item.base_price;
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    images: item.images,
                    price: finalPrice,
                    basePrice: finalPrice,
                    base_price: finalPrice,
                    discount_percent: item.discount_percent,
                    is_featured: item.is_featured,
                    allergens: item.allergens,
                    spice_level: item.spice_level,
                    prep_time: item.prep_time,
                    variants: item.itemVariants || [],
                    modifierGroups: item.modifierGroups || [],
                    isAvailable: restOverride ? restOverride.isAvailable : true
                };
            })
        })),
        menucategory: (menu.menucategory || []).map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            image_url: cat.image_url,
            items: (cat.items || []).map(item => {
                const restOverride = item.restaurantMenuItems?.[0];
                const finalPrice = (restOverride && restOverride.overridePrice !== null)
                    ? restOverride.overridePrice
                    : item.base_price;
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    images: item.images,
                    price: finalPrice,
                    basePrice: finalPrice,
                    base_price: finalPrice,
                    discount_percent: item.discount_percent,
                    is_featured: item.is_featured,
                    allergens: item.allergens,
                    spice_level: item.spice_level,
                    prep_time: item.prep_time,
                    variants: item.itemVariants || [],
                    modifierGroups: item.modifierGroups || [],
                    isAvailable: restOverride ? restOverride.isAvailable : true
                };
            })
        }))
    }));
};
