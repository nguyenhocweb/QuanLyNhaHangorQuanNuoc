import { getPromotionsRepo } from "../repositories/promotion.get.repo.js";

export const getPromotionsService = async (brandId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
    }
    if (query.search) {
        filter.code = { contains: query.search, mode: "insensitive" };
    }

    const { promotions, total } = await getPromotionsRepo(brandId, filter, skip, limit);

    return {
        items: promotions,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
