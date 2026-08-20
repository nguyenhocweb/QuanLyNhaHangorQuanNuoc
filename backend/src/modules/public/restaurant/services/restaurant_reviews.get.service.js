import { getPublicRestaurantReviewsRepo } from "../repositories/restaurant_reviews.get.repo.js";

export const getPublicRestaurantReviewsService = async (id, page = 1, limit = 10, rating = null, sortBy = "latest", hasImage = false) => {
    const skip = (page - 1) * limit;
    
    const { total, reviews } = await getPublicRestaurantReviewsRepo(id, skip, limit, rating, sortBy, hasImage);

    return {
        message: "Lấy danh sách đánh giá thành công",
        metadata: {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        },
    };
};
