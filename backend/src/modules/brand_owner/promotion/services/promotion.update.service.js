import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updatePromotionRepo, getPromotionByIdRepo } from "../repositories/promotion.update.repo.js";

export const updatePromotionService = async (brandId, promotionId, data) => {
    const existing = await getPromotionByIdRepo(brandId, promotionId);
    if (!existing) {
        throw new NotFoundError("Không tìm thấy chương trình khuyến mãi");
    }

    const { targetAudience, isActive, ...restData } = data;

    const updatedData = { ...restData };
    if (data.validFrom) updatedData.validFrom = new Date(data.validFrom);
    if (data.validUntil) updatedData.validUntil = new Date(data.validUntil);
    if (isActive !== undefined) updatedData.status = isActive ? "ACTIVE" : "INACTIVE";
    if (targetAudience !== undefined) updatedData.conditions = { targetAudience };

    const updatedPromotion = await updatePromotionRepo(brandId, promotionId, updatedData);
    return updatedPromotion;
};
