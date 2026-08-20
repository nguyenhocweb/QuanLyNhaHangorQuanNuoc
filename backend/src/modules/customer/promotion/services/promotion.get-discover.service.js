import { getDiscoverPromotionsRepo } from "../repositories/promotion.get-discover.repo.js";

export const getDiscoverPromotionsService = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || "";
    const type = query.type || "ALL"; // ALL, PLATFORM, RESTAURANT

    const discoverData = await getDiscoverPromotionsRepo(userId, { page, limit, search, type });

    return {
        items: discoverData.items,
        pagination: {
            page,
            limit,
            total: discoverData.total,
            totalPages: Math.ceil(discoverData.total / limit)
        }
    };
};
