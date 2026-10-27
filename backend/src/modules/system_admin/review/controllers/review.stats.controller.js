import { getSystemReviewStatsService } from "../services/review.stats.service.js";

export const getSystemReviewStats = async (req, res) => {
    const result = await getSystemReviewStatsService();

    return res.status(200).json({
        message: "Lấy thống kê đánh giá toàn hệ thống thành công",
        metadata: result
    });
};
