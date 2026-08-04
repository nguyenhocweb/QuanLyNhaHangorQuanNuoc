import { asyncHandler } from "../../../../../core/utils/asyncHandler.js";
import { deleteCategoryService } from "../services/category.delete.service.js";

export const deleteCategoryController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    await deleteCategoryService(userId, id);
    
    res.status(200).json({
        message: "Xóa danh mục thành công"
    });
});
