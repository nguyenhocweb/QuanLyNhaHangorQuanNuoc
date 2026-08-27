import asyncHandler from "../../../../../core/utils/asyncHandler.js";
import { getItemService } from "../services/item.get.service.js";

export const getItemController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = "", categoryId = "", menuId = "", restaurantId = "", isAvailable, isAssigned } = req.query;
    
    const result = await getItemService(userId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
        categoryId,
        menuId,
        restaurantId,
        isAvailable,
        isAssigned
    });
    
    return res.status(200).json({
        message: "Lấy danh sách món ăn thành công",
        metadata: result
    });
});
