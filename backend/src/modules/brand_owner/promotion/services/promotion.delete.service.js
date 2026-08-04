import { NotFoundError } from "../../../../core/constants/error/index.js";
import { deletePromotionRepo } from "../repositories/promotion.delete.repo.js";
import { getPromotionByIdRepo } from "../repositories/promotion.update.repo.js";

export const deletePromotionService = async (brandId, promotionId) => {
    const existing = await getPromotionByIdRepo(brandId, promotionId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy chương trình khuyến mãi");
    }

    await deletePromotionRepo(brandId, promotionId);
};
