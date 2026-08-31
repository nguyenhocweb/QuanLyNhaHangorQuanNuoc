import { getMyReviewsService } from "../services/review.get-my-reviews.service.js";

export const getMyReviews = async (req, res) => {
    const userId = req.user.id;
    const query = req.query;

    const result = await getMyReviewsService(userId, query);

    return res.status(200).json({
        message: "Lấy danh sách đánh giá cá nhân thành công",
        metadata: result
    });
};
