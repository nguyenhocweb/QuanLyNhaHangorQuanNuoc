import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updatePromotionService } from "../services/promotion.update.service.js";

export const updatePromotion = asyncHandler(async (req, res) => {
    const { id_brand, id_promotion } = req.params;
    const data = req.body;
    
    const promotion = await updatePromotionService(id_brand, id_promotion, data);
    
    res.status(200).json({
        message: "Cập nhật khuyến mãi thành công",
        data: promotion
    });
});
