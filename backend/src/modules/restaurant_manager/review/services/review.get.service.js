import reviewGetRepo from "../repositories/review.get.repo.js";

const getReviewsService = async (restaurantId, query) => {
    const { status, rating, has_response } = query;
    const filter = {};

    if (status) filter.status = status;
    if (rating) filter.overall_rating = parseInt(rating);
    if (has_response === 'true') {
        filter.staff_response = { not: null };
    } else if (has_response === 'false') {
        filter.staff_response = null;
    }

    const reviews = await reviewGetRepo.getReviews(restaurantId, filter);
    const stats = await reviewGetRepo.getReviewStats(restaurantId);

    return { reviews, stats };
};

export default { getReviewsService };