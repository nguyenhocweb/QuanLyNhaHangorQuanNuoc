import { createReviewService } from "../services/review.create.service.js";

export const createReview = async (req, res) => {
    const userId = req.user.userId;
    const data = req.body;

    const result = await createReviewService(userId, data);

    return res.status(201).json({
        message: result.message,
        metadata: result.review
    });
};
