import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getRevenueService } from "../services/subscription.revenue.service.js";

export const getRevenue = asyncHandler(async (req, res) => {
    const { month, year, page = 1, limit = 10, planName, status, search } = req.query;
    const result = await getRevenueService({ 
        month: month ? parseInt(month) : null, 
        year: year ? parseInt(year) : null,
        page: parseInt(page),
        limit: parseInt(limit),
        planName,
        status,
        search
    });
    res.status(200).json({
        message: "Lấy danh sách doanh thu thành công",
        ...result
    });
});
