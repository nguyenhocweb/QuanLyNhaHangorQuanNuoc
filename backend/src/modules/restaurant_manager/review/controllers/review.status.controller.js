import reviewStatusService from "../services/review.status.service.js";

const updateStatus = async (req, res) => {
    const restaurantId = req.body.restaurantId || req.query.restaurantId || req.user.restaurantId;
    const { id } = req.params;
    const { status } = req.body;
    
    const data = await reviewStatusService.updateReviewStatusService(id, status, restaurantId);
    return res.status(200).json({
        message: "Cập nhật trạng thái đánh giá thành công",
        metadata: data
    });
};

export default { updateStatus };