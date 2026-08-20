import { asyncHandler } from "../../../../../core/utils/asyncHandler.js";
import { updateItemService } from "../services/item.update.service.js";

export const updateItemController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const payload = req.body;
    
    const updated = await updateItemService(userId, id, payload);
    
    res.status(200).json({
        message: "Cập nhật món ăn thành công",
        metadata: updated
    });
});
