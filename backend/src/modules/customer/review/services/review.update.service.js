import { ForbiddenError, NotFoundError } from "../../../../core/constants/error/index.js";
import { getReviewByIdRepo, updateReviewRepo, recalculateRestaurantRatingRepo } from "../repositories/review.update.repo.js";

const BAD_WORDS = ["địt", "lồn", "cặc", "chó", "fuck", "bitch", "ngu"];

const containsBadWords = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some(word => lowerText.includes(word));
};

export const updateReviewService = async (userId, reviewId, data) => {
    const existingReview = await getReviewByIdRepo(reviewId);
    if (!existingReview) {
        throw new NotFoundError("Không tìm thấy bài đánh giá");
    }

    if (existingReview.userId !== userId) {
        throw new ForbiddenError("Bạn không có quyền chỉnh sửa đánh giá này");
    }

    let reviewStatus = existingReview.status;
    if (data.comment && containsBadWords(data.comment)) {
        reviewStatus = "PENDING"; // Chờ kiểm duyệt nếu có từ khóa nhạy cảm
    } else if (existingReview.status === "REJECTED_SPAM" && (!data.comment || !containsBadWords(data.comment))) {
        reviewStatus = "PENDING"; // Nếu trước đó bị từ chối và giờ sửa lại sạch, cho vào danh sách chờ duyệt lại
    }

    const updateData = {};
    if (data.overall_rating !== undefined) updateData.overall_rating = data.overall_rating;
    if (data.food_rating !== undefined) updateData.food_rating = data.food_rating;
    if (data.service_rating !== undefined) updateData.service_rating = data.service_rating;
    if (data.ambiance_rating !== undefined) updateData.ambiance_rating = data.ambiance_rating;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.images !== undefined) updateData.images = data.images;
    updateData.status = reviewStatus;

    const updatedReview = await updateReviewRepo(reviewId, updateData);

    // Tính lại điểm số trung bình của nhà hàng sau khi cập nhật
    await recalculateRestaurantRatingRepo(existingReview.restaurantId);

    return {
        review: updatedReview,
        message: reviewStatus === "PENDING" ? "Đánh giá đã được cập nhật và đang chờ kiểm duyệt lại." : "Cập nhật đánh giá thành công!"
    };
};
