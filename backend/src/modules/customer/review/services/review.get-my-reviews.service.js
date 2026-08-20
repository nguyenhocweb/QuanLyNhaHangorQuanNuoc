import { getMyReviewsRepo, getMyReviewsStatsRepo } from "../repositories/review.get-my-reviews.repo.js";

export const getMyReviewsService = async (userId, query) => {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;
    const status = query.status || "ALL";
    const rating = query.rating || undefined;

    const [listResult, stats] = await Promise.all([
        getMyReviewsRepo(userId, { page, limit, status, rating }),
        getMyReviewsStatsRepo(userId)
    ]);

    const totalPages = Math.ceil(listResult.total / limit) || 1;

    return {
        reviews: listResult.reviews,
        stats,
        pagination: {
            page,
            limit,
            total: listResult.total,
            totalPages
        }
    };
};
