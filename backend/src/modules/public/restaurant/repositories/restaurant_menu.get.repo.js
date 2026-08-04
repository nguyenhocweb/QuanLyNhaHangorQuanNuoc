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
                { brandId: restaurant.brandId }
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
            categoryMaps: {
                orderBy: {
                    sort_order: 'asc'
                },
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            itemMaps: {
                                orderBy: {
                                    sort_order: 'asc'
                                },
                                select: {
                                    menuItem: {
                                        select: {
                                            id: true,
                                            name: true,
                                            description: true,
                                            image: true,
                                            images: true,
                                            basePrice: true,
                                            is_featured: true,
                                            allergens: true,
                                            spice_level: true,
                                            prep_time: true,
                                            variants: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    price: true
                                                }
                                            },
                                            restaurantMaps: {
                                                where: {
                                                    restaurantId: restaurantId,
                                                    isAvailable: true // Item còn hàng ở nhà hàng này
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
                    }
                }
            }
        }
    });

    return activeMenus;
};
