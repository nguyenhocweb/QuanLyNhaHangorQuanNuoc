import { getDashboardBrandsRepo } from "../repositories/dashboardBrands.get.repo.js";

export const getDashboardBrandsService = async (limit) => {
    return await getDashboardBrandsRepo(limit);
};
