import { asyncHandler } from "../../../../../core/utils/asyncHandler.js";
import { createItemService } from "../services/item.create.service.js";

export const createItemController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const result = await createItemService(userId, req.body);
    
    return res.status(201).json({
        message: "Tạo món ăn thành công",
        metadata: result
    });
});
