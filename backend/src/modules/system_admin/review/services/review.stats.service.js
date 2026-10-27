import { getSystemReviewStatsRepo } from "../repositories/review.stats.repo.js";

export const getSystemReviewStatsService = async () => {
    return await getSystemReviewStatsRepo();
};
