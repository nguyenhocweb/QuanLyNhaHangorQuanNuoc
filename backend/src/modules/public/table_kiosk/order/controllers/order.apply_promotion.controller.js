import { applyTableKioskPromotionService, removeTableKioskPromotionService } from "../services/order.apply_promotion.service.js";

export const applyTableKioskPromotion = async (req, res) => {
    const { restaurantId, tableId, code } = req.body;
    const result = await applyTableKioskPromotionService({ restaurantId, tableId, code });

    return res.status(200).json({
        message: result.message,
        metadata: result
    });
};

export const removeTableKioskPromotion = async (req, res) => {
    const { restaurantId, tableId } = req.body;
    const result = await removeTableKioskPromotionService({ restaurantId, tableId });

    return res.status(200).json({
        message: result.message,
        metadata: result.order
    });
};
