import { updateReviewStatusService } from "../services/review.status.service.js";

export const updateReviewStatus = async (req, res) => {
    const { id } = req.params;
    const { is_public } = req.body;

    const result = await updateReviewStatusService(id, is_public);

    return res.status(200).json({
        message: "Cập nhật trạng thái hiển thị đánh giá thành công",
        metadata: result
    });
};
