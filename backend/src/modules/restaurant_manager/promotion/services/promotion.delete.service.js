import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getPromotionByIdRepo } from "../repositories/promotion.get.repo.js";
import { deletePromotionRepo } from "../repositories/promotion.delete.repo.js";

export const deletePromotionService = async (id) => {
    const existingPromotion = await getPromotionByIdRepo(id);
    if (!existingPromotion) {
        throw new NotFoundError("Không tìm thấy khuyến mãi");
    }

    await deletePromotionRepo(id);
    return true;
};
