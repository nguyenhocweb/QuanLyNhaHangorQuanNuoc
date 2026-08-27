import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createPromotionService } from "../services/promotion.create.service.js";

export const createPromotion = asyncHandler(async (req, res) => {
    const { id_brand } = req.params;
    const data = req.body;
    
    const promotion = await createPromotionService(id_brand, data);
    
    res.status(201).json({
        message: "Tạo khuyến mãi thành công",
        data: promotion
    });
});
