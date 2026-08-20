import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { deletePromotionService } from "../services/promotion.delete.service.js";

export const deletePromotion = asyncHandler(async (req, res) => {
    const { id_brand, id_promotion } = req.params;
    
    await deletePromotionService(id_brand, id_promotion);
    
    res.status(200).json({
        message: "Xóa khuyến mãi thành công"
    });
});
