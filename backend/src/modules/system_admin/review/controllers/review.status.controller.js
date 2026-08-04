import { updateReviewStatusService } from "../services/review.status.service.js";

export const updateReviewStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await updateReviewStatusService(id, status);

    return res.status(200).json({
        message: "Cập nhật trạng thái đánh giá thành công",
        metadata: result
    });
};
