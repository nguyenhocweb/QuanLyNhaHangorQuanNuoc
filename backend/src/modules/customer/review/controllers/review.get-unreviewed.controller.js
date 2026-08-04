import { getUnreviewedMealsService } from "../services/review.get-unreviewed.service.js";

export const getUnreviewedMeals = async (req, res) => {
    const userId = req.user.userId;
    const query = req.query;

    const result = await getUnreviewedMealsService(userId, query);

    return res.status(200).json({
        message: "Lấy danh sách bữa ăn chờ đánh giá thành công",
        metadata: result
    });
};
