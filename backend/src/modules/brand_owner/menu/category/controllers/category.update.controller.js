import asyncHandler from "../../../../../core/utils/asyncHandler.js";
import { updateCategoryService } from "../services/category.update.service.js";

export const updateCategoryController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const payload = req.body;
    
    const updated = await updateCategoryService(userId, id, payload);
    
    res.status(200).json({
        message: "Cập nhật danh mục thành công",
        metadata: updated
    });
});
