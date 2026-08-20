import reviewReplyService from "../services/review.reply.service.js";

const replyReview = async (req, res) => {
    const restaurantId = req.body.restaurantId || req.query.restaurantId || req.user.restaurantId;
    const { id } = req.params;
    const { staff_response } = req.body;
    
    const data = await reviewReplyService.replyReviewService(id, staff_response, restaurantId);
    return res.status(200).json({
        message: "Phản hồi đánh giá thành công",
        metadata: data
    });
};

export default { replyReview };