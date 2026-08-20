import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getPromotionsRepo, getPromotionByIdRepo } from "../repositories/promotion.get.repo.js";

export const getPromotionsService = async (brandId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.search) {
        filter.code = { contains: query.search, mode: 'insensitive' };
    }

    const { promotions, total } = await getPromotionsRepo(brandId, filter, skip, limit);

    return {
        items: promotions,
        metadata: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getPromotionByIdService = async (brandId, promotionId) => {
    const promotion = await getPromotionByIdRepo(brandId, promotionId);
    if (!promotion) {
        throw new NotFoundError("Không tìm thấy chương trình khuyến mãi");
    }
    
    // Map relations to flat arrays of IDs for the frontend form
    const mappedPromotion = {
        ...promotion,
        restaurantIds: promotion.promotionRestaurants ? promotion.promotionRestaurants.map(pr => pr.restaurantId) : [],
        menuItemIds: promotion.promotionMenuItems ? promotion.promotionMenuItems.map(pm => pm.menuItemId) : [],
        isActive: promotion.status === 'ACTIVE',
        targetAudience: promotion.conditions?.targetAudience || 'ALL'
    };
    
    delete mappedPromotion.promotionRestaurants;
    delete mappedPromotion.promotionMenuItems;
    delete mappedPromotion.conditions;
    
    return mappedPromotion;
};
