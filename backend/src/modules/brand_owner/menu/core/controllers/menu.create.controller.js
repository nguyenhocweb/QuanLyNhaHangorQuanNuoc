import { createMenuService } from "../services/menu.create.service.js";
import { asyncHandler } from "../../../../../core/utils/asyncHandler.js";

export const createMenuController = asyncHandler(async (req, res) => {
    const result = await createMenuService(req.user.id, req.body);
    
    return res.status(201).json({
        message: "Tạo thực đơn thành công",
        metadata: result
    });
});
