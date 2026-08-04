import { getReviewWithRestaurant, updateReviewReplyRepo } from "../repositories/review.reply.repo.js";
import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";

export const replyReviewService = async (brandId, reviewId, staffResponse) => {
    const review = await getReviewWithRestaurant(reviewId);
    if (!review) {
        throw new NotFoundError("Không tìm thấy đánh giá này");
    }

    if (review.restaurant.brandId !== brandId) {
        throw new ForbiddenError("Bạn không có quyền phản hồi đánh giá của nhà hàng này");
    }

    const updatedReview = await updateReviewReplyRepo(reviewId, staffResponse);
    return updatedReview;
};
