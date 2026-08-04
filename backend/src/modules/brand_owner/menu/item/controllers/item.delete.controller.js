import { asyncHandler } from "../../../../../core/utils/asyncHandler.js";
import { deleteItemService } from "../services/item.delete.service.js";

export const deleteItemController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    await deleteItemService(userId, id);
    
    res.status(200).json({
        message: "Xóa món ăn thành công"
    });
});
