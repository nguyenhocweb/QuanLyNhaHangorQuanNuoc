import { ForbiddenError, NotFoundError } from "../../../../core/constants/error/index.js";
import { getReviewByIdRepo } from "../repositories/review.update.repo.js";
import { deleteReviewRepo } from "../repositories/review.delete.repo.js";

export const deleteReviewService = async (userId, reviewId) => {
    const existingReview = await getReviewByIdRepo(reviewId);
    if (!existingReview) {
        throw new NotFoundError("Không tìm thấy bài đánh giá");
    }

    if (existingReview.userId !== userId) {
        throw new ForbiddenError("Bạn không có quyền xóa đánh giá này");
    }

    await deleteReviewRepo(reviewId);

    return {
        message: "Xóa bài đánh giá thành công!"
    };
};
