import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getPromotionsService, getPromotionByIdService } from "../services/promotion.get.service.js";

export const getPromotions = asyncHandler(async (req, res) => {
    const { id_brand } = req.params;
    const query = req.query; // pagination & filter
    
    const promotions = await getPromotionsService(id_brand, query);
    
    res.status(200).json({
        message: "Lấy danh sách khuyến mãi thành công",
        data: promotions
    });
});

export const getPromotionById = asyncHandler(async (req, res) => {
    const { id_brand, id_promotion } = req.params;
    console.log("getPromotionById called with", id_brand, id_promotion);
    
    const promotion = await getPromotionByIdService(id_brand, id_promotion);
    
    res.status(200).json({
        message: "Lấy chi tiết khuyến mãi thành công",
        data: promotion
    });
});
