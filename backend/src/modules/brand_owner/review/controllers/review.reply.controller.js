import { replyReviewService } from "../services/review.reply.service.js";

export const replyReview = async (req, res) => {
    const { id_brand, id } = req.params;
    const { staff_response } = req.body;

    const result = await replyReviewService(id_brand, id, staff_response);

    return res.status(200).json({
        message: "Phản hồi đánh giá thành công",
        metadata: result
    });
};
