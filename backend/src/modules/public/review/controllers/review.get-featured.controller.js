import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getFeaturedReviewsService } from "../services/review.get-featured.service.js";

export const getFeaturedReviewsController = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 9;
    const metadata = await getFeaturedReviewsService(limit);
    
    return res.status(200).json({
        message: "Lấy danh sách đánh giá thực tế nổi bật thành công",
        metadata
    });
});
