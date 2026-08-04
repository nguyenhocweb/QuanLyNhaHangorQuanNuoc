import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy danh sách các ưu đãi đang có hiệu lực trên toàn hệ thống hoặc nhà hàng để khám phá
 */
export const getDiscoverPromotionsRepo = async (userId, { page = 1, limit = 10, search, type }) => {
    const skip = (page - 1) * limit;
    const now = new Date();

    const where = {
        isActive: true,
        valid_until: {
            gte: now
        }
    };

    if (search) {
        where.OR = [
            { code: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
        ];
    }

    if (type === "PLATFORM") {
        where.restaurantId = null;
        where.brandId = null;
    } else if (type === "RESTAURANT") {
        where.restaurantId = { not: null };
    }

    // 1. Lấy danh sách khuyến mãi hợp lệ
    const [promotions, total] = await Promise.all([
        prisma.promotion.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: {
                valid_until: 'asc'
            }
        }),
        prisma.promotion.count({ where })
    ]);

    if (promotions.length === 0) {
        return { items: [], total: 0 };
    }

    // 2. Lấy thông tin Restaurant & Brand tương ứng
    const restaurantIds = [...new Set(promotions.map(p => p.restaurantId).filter(Boolean))];
    const brandIds = [...new Set(promotions.map(p => p.brandId).filter(Boolean))];

    const [restaurants, brands, userSaved] = await Promise.all([
        restaurantIds.length > 0 ? prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: { id: true, name: true, logo: true, address: true, imageMain: true }
        }) : [],
        brandIds.length > 0 ? prisma.brand.findMany({
            where: { id: { in: brandIds } },
            select: { id: true, name: true, logo: true }
        }) : [],
        userId ? prisma.userPromotion.findMany({
            where: { userId },
            select: { promotionId: true }
        }) : []
    ]);

    const restaurantMap = new Map(restaurants.map(r => [r.id, r]));
    const brandMap = new Map(brands.map(b => [b.id, b]));
    const savedSet = new Set(userSaved.map(us => us.promotionId));

    // 3. Ghép dữ liệu và thêm cờ isSaved
    const items = promotions.map(p => {
        const resInfo = p.restaurantId ? restaurantMap.get(p.restaurantId) : null;
        const brandInfo = p.brandId ? brandMap.get(p.brandId) : null;

        return {
            ...p,
            restaurant: resInfo || null,
            brand: brandInfo || null,
            isSaved: savedSet.has(p.id)
        };
    });

    return { items, total };
};
