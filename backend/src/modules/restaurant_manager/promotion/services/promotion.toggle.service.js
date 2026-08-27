import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getPromotionByIdRepo } from "../repositories/promotion.get.repo.js";
import { updatePromotionRepo } from "../repositories/promotion.update.repo.js";
export const togglePromotionService = async (id) => {
    const existingPromotion = await getPromotionByIdRepo(id);
    if (!existingPromotion) {
        throw new NotFoundError("Không tìm thấy khuyến mãi");
    }

    // Toggle isActive true <-> false
    const newStatus = !existingPromotion.isActive;

    const updatedPromotion = await updatePromotionRepo(id, { isActive: newStatus });

    return updatedPromotion;
};
