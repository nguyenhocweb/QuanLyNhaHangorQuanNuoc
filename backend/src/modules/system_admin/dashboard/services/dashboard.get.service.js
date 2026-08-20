import { getDashboardStatsRepo } from "../repositories/dashboard.get.repo.js";

export const getDashboardStatsService = async () => {
    return await getDashboardStatsRepo();
};
