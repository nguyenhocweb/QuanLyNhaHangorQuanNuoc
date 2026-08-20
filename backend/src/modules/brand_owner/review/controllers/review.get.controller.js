import { getBrandReviewsService } from "../services/review.get.service.js";

export const getBrandReviews = async (req, res) => {
    const { id_brand } = req.params;
    const queryParams = req.query;

    const result = await getBrandReviewsService(id_brand, queryParams);

    return res.status(200).json({
        message: "Lấy danh sách đánh giá thành công",
        metadata: result
    });
};
