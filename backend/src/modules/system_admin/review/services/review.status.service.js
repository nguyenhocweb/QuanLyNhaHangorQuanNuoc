import { getReviewById, updateReviewStatusRepo } from "../repositories/review.status.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateReviewStatusService = async (reviewId, status) => {
    const review = await getReviewById(reviewId);
    if (!review) {
        throw new NotFoundError("Không tìm thấy đánh giá này");
    }

    const updatedReview = await updateReviewStatusRepo(reviewId, status);
    return updatedReview;
};
