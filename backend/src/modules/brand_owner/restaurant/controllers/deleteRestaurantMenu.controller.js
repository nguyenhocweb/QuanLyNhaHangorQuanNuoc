import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { deleteRestaurantMenuService } from "../services/deleteRestaurantMenu.service.js";

export const deleteRestaurantMenuController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id_brand } = req.params;
    const { id, menuItemId } = req.params; // id là restaurantId

    await deleteRestaurantMenuService(userId, id_brand, id, menuItemId);

    return res.status(200).json({
        message: "Hủy phân bổ món ăn thành công",
    });
});
