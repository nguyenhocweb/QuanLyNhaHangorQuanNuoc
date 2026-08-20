import { getUnreviewedMealsRepo } from "../repositories/review.get-unreviewed.repo.js";

export const getUnreviewedMealsService = async (userId, query) => {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;

    const result = await getUnreviewedMealsRepo(userId, { page, limit });
    const totalPages = Math.ceil(result.total / limit) || 1;

    return {
        meals: result.meals,
        pagination: {
            page,
            limit,
            total: result.total,
            totalPages
        }
    };
};
