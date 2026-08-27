import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getRestaurantMenuService } from "../services/menu.get.service.js";

export const getRestaurantMenuController = asyncHandler(async (req, res) => {
    const { restaurantId, ...params } = req.query;
    const result = await getRestaurantMenuService(restaurantId, params, req.user);
    res.status(200).json({
        message: "Lấy thực đơn chi nhánh thành công",
        metadata: result
    });
});
