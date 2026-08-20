import reviewGetService from "../services/review.get.service.js";

const getReviews = async (req, res) => {
    const restaurantId = req.query.restaurantId || req.user.restaurantId;
    const data = await reviewGetService.getReviewsService(restaurantId, req.query);
    return res.status(200).json({
        message: "Lấy danh sách đánh giá thành công",
        metadata: data
    });
};

export default { getReviews };