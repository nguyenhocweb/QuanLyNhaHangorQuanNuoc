import { deleteReviewService } from "../services/review.delete.service.js";

export const deleteReview = async (req, res) => {
    const userId = req.user.userId;
    const reviewId = req.params.id;

    const result = await deleteReviewService(userId, reviewId);

    return res.status(200).json({
        message: result.message,
        metadata: null
    });
};
