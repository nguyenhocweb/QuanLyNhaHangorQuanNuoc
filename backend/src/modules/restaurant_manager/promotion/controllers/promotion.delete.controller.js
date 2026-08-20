import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { deletePromotionService } from "../services/promotion.delete.service.js";

const deletePromotion = async (req, res) => {
    const { id } = req.params;
    await deletePromotionService(id);
    res.status(200).json({
        success: true,
        message: "Xóa khuyến mãi thành công"
    });
};

export default { deletePromotion };
