import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateRestaurantMenuService } from "../services/menu.update.service.js";

export const updateRestaurantMenuController = asyncHandler(async (req, res) => {
    const { menuItemId } = req.params;
    const { restaurantId } = req.query;
    const result = await updateRestaurantMenuService(restaurantId, menuItemId, req.body, req.user);
    res.status(200).json({
        message: "Cập nhật thông tin món tại chi nhánh thành công",
        metadata: result
    });
});
