import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getDashboardBrandsService } from "../services/dashboardBrands.get.service.js";

export const getDashboardBrands = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const data = await getDashboardBrandsService(limit);
    res.status(200).json(data);
});
