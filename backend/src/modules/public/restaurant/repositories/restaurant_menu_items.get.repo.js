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
        OR: [
            { restaurantId: restaurantId },
            ...(restaurant.brandId ? [{ brandId: restaurant.brandId }] : [])
        ],
        is_available: true
    };

    if (search && search.trim()) {
        whereCondition.name = { contains: search.trim(), mode: "insensitive" };
    }

    if (categoryId && categoryId.trim()) {
        whereCondition.categoryId = categoryId.trim();
    }

    if (menuId && menuId.trim()) {
        whereCondition.category = {
            menuId: menuId.trim()
        };
    }

    // 3. Thực thi Query Lấy dữ liệu và Count
    const [total, items] = await Promise.all([
        prisma.menuItem.count({ where: whereCondition }),
        prisma.menuItem.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: [
                { is_featured: 'desc' },
                { sort_order: 'asc' }
            ],
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
                category: {
                    select: {
                        id: true,
                        name: true,
                        menu: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                itemVariants: {
                    select: {
                        id: true,
                        name: true,
                        price: true
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
        })
    ]);

    const formattedItems = items.map(item => {
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
            basePrice: finalPrice,
            base_price: finalPrice,
            discount_percent: item.discount_percent,
            is_featured: item.is_featured,
            allergens: item.allergens,
            spice_level: item.spice_level,
            prep_time: item.prep_time,
            categoryName: item.category?.name,
            menuName: item.category?.menu?.name,
            variants: item.itemVariants || [],
            isAvailable: restOverride ? restOverride.isAvailable : true
        };
    });

    return { total, items: formattedItems };
};
