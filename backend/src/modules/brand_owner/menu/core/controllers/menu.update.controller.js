import { updateMenuService } from "../services/menu.update.service.js";
import { asyncHandler } from "../../../../../core/utils/asyncHandler.js";

export const updateMenuController = asyncHandler(async (req, res) => {
    const result = await updateMenuService(req.user.id, req.params.id, req.body);
    
    return res.status(200).json({
        message: "Cập nhật thực đơn thành công",
        metadata: result
    });
});
