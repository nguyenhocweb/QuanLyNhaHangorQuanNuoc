import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getPublicMenuItemsRepo = async (restaurantId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 6;
    const { search, menuId, categoryId } = query;
    const skip = (page - 1) * limit;

    // 1. Lấy thông tin nhà hàng để biết brandId
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { brandId: true }
    });

    if (!restaurant) {
        throw new NotFoundError("Không tìm thấy thông tin nhà hàng");
    }

    // 2. Xây dựng bộ điều kiện filter cho MenuItem
    const whereCondition = {
        // Chỉ lấy món ăn được PHÂN BỔ cho chi nhánh và có isAvailable = true
        restaurantMaps: {
            some: {
                restaurantId: restaurantId,
                isAvailable: true
            }
        },
        // Phải thuộc Menu đang active của nhà hàng hoặc thương hiệu
        categoryMaps: {
            some: {
                category: {
                    menuMaps: {
                        some: {
                            menu: {
                                is_active: true,
                                OR: [
                                    { restaurantId: restaurantId },
                                    { brandId: restaurant.brandId }
                                ]
                            }
                        }
                    }
                }
            }
        }
    };

    if (search) {
        whereCondition.name = { contains: search, mode: "insensitive" };
    }

    if (categoryId) {
        // Món ăn phải thuộc danh mục này
        whereCondition.categoryMaps.some.categoryId = categoryId;
    }

    if (menuId) {
        // Món ăn phải thuộc Menu này
        whereCondition.categoryMaps.some.category.menuMaps.some.menuId = menuId;
    }

    // 3. Thực thi Query Lấy dữ liệu và Count (cho phân trang)
    const [total, items] = await Promise.all([
        prisma.menuItem.count({ where: whereCondition }),
        prisma.menuItem.findMany({
            where: whereCondition,
            skip,
            take: limit,
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
                        restaurantId: restaurantId
                    },
                    select: {
                        overridePrice: true,
                        isAvailable: true
                    }
                },
                // Include category name and menu name if needed for UI badges
                categoryMaps: {
                    select: {
                        category: {
                            select: {
                                name: true,
                                menuMaps: {
                                    select: {
                                        menu: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    take: 1
                }
            }
        })
    ]);

    return { total, items };
};
