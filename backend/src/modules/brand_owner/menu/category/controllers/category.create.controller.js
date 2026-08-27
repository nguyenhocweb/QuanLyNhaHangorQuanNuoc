import asyncHandler from "../../../../../core/utils/asyncHandler.js";
import { createCategoryService } from "../services/category.create.service.js";

export const createCategoryController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const result = await createCategoryService(userId, req.body);
    
    return res.status(201).json({
        message: "Tạo danh mục thành công",
        metadata: result
    });
});
