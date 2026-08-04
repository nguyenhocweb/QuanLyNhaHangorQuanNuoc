import { updateReviewService } from "../services/review.update.service.js";

export const updateReview = async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.id;
    const data = req.body;

    const result = await updateReviewService(userId, reviewId, data);

    return res.status(200).json({
        message: result.message,
        metadata: result.review
    });
};
