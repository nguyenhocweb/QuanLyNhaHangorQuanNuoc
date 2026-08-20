import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy danh sách voucher trong ví của khách hàng (chống lỗi orphaned data bằng truy vấn 2 bước)
 */
export const getMyVoucherWalletRepo = async (userId, { page = 1, limit = 10, status }) => {
    const skip = (page - 1) * limit;

    const where = {
        userId: userId
    };

    if (status === "USED") {
        where.isUsed = true;
    } else if (status === "ACTIVE" || status === "EXPIRING_SOON") {
        where.isUsed = false;
    }

    // 1. Lấy danh sách các bản ghi lưu trong ví user_promotions
    const [userPromotions, total] = await Promise.all([
        prisma.userPromotion.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: {
                savedAt: 'desc'
            }
        }),
        prisma.userPromotion.count({ where })
    ]);

    if (userPromotions.length === 0) {
        return { items: [], total: 0 };
    }

    // 2. Lấy thông tin Promotion tương ứng
    const promotionIds = [...new Set(userPromotions.map(up => up.promotionId).filter(Boolean))];
    const promotions = await prisma.promotion.findMany({
        where: { id: { in: promotionIds } }
    });
    const promotionMap = new Map(promotions.map(p => [p.id, p]));

    // 3. Lấy thông tin Restaurant và Brand nếu có
    const restaurantIds = [...new Set(promotions.map(p => p.restaurantId).filter(Boolean))];
    const brandIds = [...new Set(promotions.map(p => p.brandId).filter(Boolean))];

    const [restaurants, brands] = await Promise.all([
        restaurantIds.length > 0 ? prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: { id: true, name: true, logo: true, address: true, imageMain: true }
        }) : [],
        brandIds.length > 0 ? prisma.brand.findMany({
            where: { id: { in: brandIds } },
            select: { id: true, name: true, logo: true }
        }) : []
    ]);

    const restaurantMap = new Map(restaurants.map(r => [r.id, r]));
    const brandMap = new Map(brands.map(b => [b.id, b]));

    // 4. Ghép dữ liệu và lọc bổ sung theo thời gian nếu cần
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    let mappedItems = userPromotions.map(up => {
        const promo = promotionMap.get(up.promotionId);
        if (!promo) return null;

        const resInfo = promo.restaurantId ? restaurantMap.get(promo.restaurantId) : null;
        const brandInfo = promo.brandId ? brandMap.get(promo.brandId) : null;

        return {
            id: up.id,
            userId: up.userId,
            promotionId: up.promotionId,
            isUsed: up.isUsed,
            usedAt: up.usedAt,
            savedAt: up.savedAt,
            promotion: {
                ...promo,
                restaurant: resInfo || null,
                brand: brandInfo || null
            }
        };
    }).filter(Boolean);

    // Lọc chi tiết active / expiring_soon / expired trong bộ nhớ
    if (status === "ACTIVE") {
        mappedItems = mappedItems.filter(item => {
            const validUntil = new Date(item.promotion.validUntil);
            return validUntil >= now && item.promotion.isActive;
        });
    } else if (status === "EXPIRING_SOON") {
        mappedItems = mappedItems.filter(item => {
            const validUntil = new Date(item.promotion.validUntil);
            return validUntil >= now && validUntil <= threeDaysLater && item.promotion.isActive;
        });
    } else if (status === "EXPIRED") {
        mappedItems = mappedItems.filter(item => {
            const validUntil = new Date(item.promotion.validUntil);
            return validUntil < now || !item.promotion.isActive;
        });
    }

    return {
        items: mappedItems,
        total: mappedItems.length // Cập nhật lại tổng sau khi lọc chi tiết thời gian
    };
};

/**
 * Thống kê tổng quan ví voucher của khách hàng
 */
export const getMyVoucherWalletStatsRepo = async (userId) => {
    const userPromotions = await prisma.userPromotion.findMany({
        where: { userId }
    });

    if (userPromotions.length === 0) {
        return { totalSaved: 0, activeCount: 0, expiringSoonCount: 0, usedCount: 0 };
    }

    const promotionIds = [...new Set(userPromotions.map(up => up.promotionId).filter(Boolean))];
    const promotions = await prisma.promotion.findMany({
        where: { id: { in: promotionIds } }
    });
    const promotionMap = new Map(promotions.map(p => [p.id, p]));

    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    let activeCount = 0;
    let expiringSoonCount = 0;
    let usedCount = 0;

    userPromotions.forEach(up => {
        if (up.isUsed) {
            usedCount++;
            return;
        }
        const promo = promotionMap.get(up.promotionId);
        if (promo && promo.isActive) {
            const validUntil = new Date(promo.validUntil);
            if (validUntil >= now) {
                activeCount++;
                if (validUntil <= threeDaysLater) {
                    expiringSoonCount++;
                }
            }
        }
    });

    return {
        totalSaved: userPromotions.length,
        activeCount,
        expiringSoonCount,
        usedCount
    };
};
