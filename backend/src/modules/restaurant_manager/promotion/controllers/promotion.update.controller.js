import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updatePromotionService } from "../services/promotion.update.service.js";

const updatePromotion = async (req, res) => {
    const { id } = req.params;
    const result = await updatePromotionService(id, req.body);
    res.status(200).json({
        success: true,
        message: "Cập nhật khuyến mãi thành công",
        metadata: result
    });
};

export default { updatePromotion };
