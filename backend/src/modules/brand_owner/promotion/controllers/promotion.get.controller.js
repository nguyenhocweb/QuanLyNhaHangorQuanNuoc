import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getPromotionsService } from "../services/promotion.get.service.js";

export const getPromotions = asyncHandler(async (req, res) => {
    const { id_brand } = req.params;
    const query = req.query; // pagination & filter
    
    const promotions = await getPromotionsService(id_brand, query);
    
    res.status(200).json({
        message: "Lấy danh sách khuyến mãi thành công",
        data: promotions
    });
});
