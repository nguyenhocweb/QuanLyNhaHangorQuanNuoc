import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getPromotionsRepo, getPromotionByIdRepo } from "../repositories/promotion.get.repo.js";

import { prisma } from "../../../../databases/init.mongodb.js";

export const getPromotionsService = async (query = {}) => {
    const filter = {};
    
    if (query.restaurantId) {
        // Lấy brandId của nhà hàng hiện tại
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: query.restaurantId },
            select: { brandId: true }
        });

        if (restaurant && restaurant.brandId) {
            filter.OR = [
                // 1. Có map với nhà hàng này
                { promotionRestaurants: { some: { restaurantId: query.restaurantId } } },
                // 2. Thuộc cùng brand và áp dụng toàn chuỗi (mảng map rỗng)
                {
                    AND: [
                        { brandId: restaurant.brandId },
                        { promotionRestaurants: { none: {} } }
                    ]
                }
            ];
        } else {
            // Nếu không có brandId (vô lý nhưng đề phòng), fallback
            filter.promotionRestaurants = { some: { restaurantId: query.restaurantId } };
        }
    }
    
    if (query.status) filter.status = query.status;

    const promotions = await getPromotionsRepo(filter);
    return promotions;
};

export const getPromotionByIdService = async (id) => {
    const promotion = await getPromotionByIdRepo(id);
    if (!promotion) {
        throw new NotFoundError("Không tìm thấy khuyến mãi");
    }
    return promotion;
};
