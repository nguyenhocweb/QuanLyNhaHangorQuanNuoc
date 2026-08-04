import { getReviewsByRestaurantRepo } from "../repositories/review.get-by-restaurant.repo.js";

export const getReviewsByRestaurantService = async (restaurantId, queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    
    let filter = {};
    if (queryParams.rating) {
        filter.overall_rating = parseInt(queryParams.rating);
    }

    const sortBy = queryParams.sortBy || "newest";

    const { total, reviews } = await getReviewsByRestaurantRepo(restaurantId, filter, skip, limit, sortBy);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
