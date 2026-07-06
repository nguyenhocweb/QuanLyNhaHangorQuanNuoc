import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateCategoryRestaurantService } from "../services/updateCategory.service.js";

export const updateCategoryRestaurantController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await updateCategoryRestaurantService(id, req.body);
    return res.status(200).json({
        message: "Cập nhật loại hình nhà hàng thành công",
        data
    });
});
