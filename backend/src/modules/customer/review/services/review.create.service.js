import { BadRequestError, ForbiddenError, NotFoundError } from "../../../../core/constants/error/index.js";
import { createReviewRepo, getReservationForReview } from "../repositories/review.create.repo.js";
import { recalculateRestaurantRatingRepo } from "../repositories/review.update.repo.js";

// A basic bad words list for demonstration
const BAD_WORDS = ["địt", "lồn", "cặc", "chó", "fuck", "bitch", "ngu"];

const containsBadWords = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some(word => lowerText.includes(word));
};

export const createReviewService = async (userId, data) => {
    // 1. Validate reservation
    const reservation = await getReservationForReview(data.reservationId);
    if (!reservation) {
        throw new NotFoundError("Không tìm thấy thông tin đặt bàn");
    }

    if (reservation.userId !== userId) {
        throw new ForbiddenError("Bạn không có quyền đánh giá đơn đặt bàn này");
    }

    if (reservation.status !== "COMPLETED") {
        throw new BadRequestError("Bạn chỉ được đánh giá sau khi đã hoàn tất bữa ăn (Trạng thái đặt bàn: COMPLETED)");
    }

    // 2. Profanity check
    let reviewStatus = "APPROVED";
    if (containsBadWords(data.comment)) {
        reviewStatus = "PENDING"; // Needs manual approval
    }

    // 3. Prepare data and save
    const reviewData = {
        userId: userId,
        restaurantId: reservation.restaurantId,
        reservationId: data.reservationId,
        overall_rating: data.overall_rating,
        food_rating: data.food_rating,
        service_rating: data.service_rating,
        ambiance_rating: data.ambiance_rating,
        comment: data.comment,
        images: data.images || [],
        status: reviewStatus
    };

    // Note: Prisma will throw a unique constraint error if a review for this reservationId already exists.
    // We can let the global error handler catch it, or check it explicitly.
    try {
        const review = await createReviewRepo(reviewData);
        await recalculateRestaurantRatingRepo(reservation.restaurantId);
        return {
            review,
            message: reviewStatus === "PENDING" ? "Đánh giá của bạn đang được chờ kiểm duyệt." : "Cảm ơn bạn đã để lại đánh giá!"
        };
    } catch (error) {
        if (error.code === 'P2002') {
            throw new BadRequestError("Bạn đã đánh giá cho hóa đơn này rồi, không thể đánh giá lại.");
        }
        throw error;
    }
};
