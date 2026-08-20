import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { createPromotionService } from "../services/promotion.create.service.js";

const createPromotion = async (req, res) => {
    const result = await createPromotionService(req.body);
    res.status(201).json({
        success: true,
        message: "Tạo khuyến mãi thành công",
        metadata: result
    });
};

export default { createPromotion };
