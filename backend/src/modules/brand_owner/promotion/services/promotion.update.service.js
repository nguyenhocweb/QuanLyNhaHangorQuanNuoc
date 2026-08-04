import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updatePromotionRepo, getPromotionByIdRepo } from "../repositories/promotion.update.repo.js";

export const updatePromotionService = async (brandId, promotionId, data) => {
    const existing = await getPromotionByIdRepo(brandId, promotionId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy chương trình khuyến mãi");
    }

    const updatedData = { ...data };
    if (data.valid_from) updatedData.valid_from = new Date(data.valid_from);
    if (data.valid_until) updatedData.valid_until = new Date(data.valid_until);

    const updatedPromotion = await updatePromotionRepo(brandId, promotionId, updatedData);
    return updatedPromotion;
};
