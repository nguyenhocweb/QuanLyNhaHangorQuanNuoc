import { deleteMenuService } from "../services/menu.delete.service.js";
import asyncHandler from "../../../../../core/utils/asyncHandler.js";

export const deleteMenuController = asyncHandler(async (req, res) => {
    const result = await deleteMenuService(req.user.id, req.params.id);
    
    return res.status(200).json({
        message: "Xóa thực đơn thành công",
        metadata: result
    });
});
