import { getMenuService } from "../services/menu.get.service.js";
import asyncHandler from "../../../../../core/utils/asyncHandler.js";

export const getMenuController = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    let is_active;
    if (req.query.is_active !== undefined) {
        is_active = req.query.is_active === 'true';
    }
    const sort_order = req.query.sort_order ? parseInt(req.query.sort_order) : undefined;

    const result = await getMenuService(req.user.id, { page, limit, search, is_active, sort_order });
    
    return res.status(200).json({
        message: "Lấy danh sách thực đơn thành công",
        metadata: result
    });
});
