import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getPromotionsService, getPromotionByIdService } from "../services/promotion.get.service.js";

const getPromotions = async (req, res) => {
    // Lấy restaurantId từ query hoặc từ auth middleware
    const restaurantId = req.query.restaurantId;
    const result = await getPromotionsService({ restaurantId, ...req.query });
    res.status(200).json({
        success: true,
        message: "Lấy danh sách khuyến mãi thành công",
        metadata: result
    });
};

const getPromotionById = async (req, res) => {
    const { id } = req.params;
    const result = await getPromotionByIdService(id);
    res.status(200).json({
        success: true,
        message: "Lấy chi tiết khuyến mãi thành công",
        metadata: result
    });
};

export default { getPromotions, getPromotionById };
