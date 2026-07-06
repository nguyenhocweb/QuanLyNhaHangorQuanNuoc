import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteCategoryRestaurantService } from "../services/deleteCategory.service.js";

export const deleteCategoryRestaurantController = asyncHandler(async(req, res) => {
    const { id } = req.params;
    await deleteCategoryRestaurantService(id);
    return res.status(200).json({ message: "Xóa danh mục thành công" });
});
