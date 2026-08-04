import { getFeaturedReviewsRepo } from "../repositories/review.get-featured.repo.js";

export const getFeaturedReviewsService = async (limit = 9) => {
    const reviews = await getFeaturedReviewsRepo(limit);
    return {
        items: reviews,
        total: reviews.length
    };
};
