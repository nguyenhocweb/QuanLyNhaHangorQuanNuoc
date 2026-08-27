import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { togglePromotionService } from "../services/promotion.toggle.service.js";

const togglePromotion = async (req, res) => {
    const { id } = req.params;
    const result = await togglePromotionService(id);
    res.status(200).json({
        success: true,
        message: "Thay đổi trạng thái khuyến mãi thành công",
        metadata: result
    });
};

export default { togglePromotion };
