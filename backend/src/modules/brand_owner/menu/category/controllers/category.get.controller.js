import asyncHandler from "../../../../../core/utils/asyncHandler.js";
import { getCategoryService } from "../services/category.get.service.js";

export const getCategoryController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Extrapolate filters/pagination if needed
    const { page = 1, limit = 10, search = "", is_active, sort_order } = req.query;
    
    let isActiveBool = undefined;
    if (is_active === 'true' || is_active === '1') isActiveBool = true;
    if (is_active === 'false' || is_active === '0') isActiveBool = false;

    const result = await getCategoryService(userId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
        is_active: isActiveBool,
        sort_order: sort_order !== undefined && sort_order !== '' ? parseInt(sort_order, 10) : undefined
    });
    
    return res.status(200).json({
        message: "Lấy danh sách danh mục thành công",
        metadata: result
    });
});
