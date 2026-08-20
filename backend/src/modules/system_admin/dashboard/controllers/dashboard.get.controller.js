import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getDashboardStatsService } from "../services/dashboard.get.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const data = await getDashboardStatsService();
    res.status(200).json(data);
});
