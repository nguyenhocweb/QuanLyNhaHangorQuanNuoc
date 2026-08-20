import { getReviewsByRestaurantService } from "../services/review.get-by-restaurant.service.js";

export const getReviewsByRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
    const queryParams = req.query;

    const result = await getReviewsByRestaurantService(restaurantId, queryParams);

    return res.status(200).json({
        message: "Lấy danh sách đánh giá thành công",
        metadata: result
    });
};
