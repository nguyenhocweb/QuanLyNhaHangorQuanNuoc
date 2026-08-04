import { getSystemReviewsService } from "../services/review.get.service.js";

export const getSystemReviews = async (req, res) => {
    const queryParams = req.query;
    const result = await getSystemReviewsService(queryParams);

    return res.status(200).json({
        message: "Lấy danh sách đánh giá toàn hệ thống thành công",
        metadata: result
    });
};
