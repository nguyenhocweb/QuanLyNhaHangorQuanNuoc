import { getBrandRestaurantsService } from "../services/brand_restaurants.get.service.js";

export const getBrandRestaurantsController = async (req, res) => {
    const userId = req.user.id;
    const restaurants = await getBrandRestaurantsService(userId);
    
    return res.status(200).json({
        message: "Lấy danh sách nhà hàng thành công",
        data: restaurants
    });
};
