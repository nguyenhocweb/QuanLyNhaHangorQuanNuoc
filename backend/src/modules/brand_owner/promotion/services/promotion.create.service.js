import { ConflictError } from "../../../../core/constants/error/index.js";
import { createPromotionRepo, checkCodeExistsRepo } from "../repositories/promotion.create.repo.js";

export const createPromotionService = async (brandId, data) => {
    // Check if code already exists for this brand
    const existingCode = await checkCodeExistsRepo(data.code, brandId);
    if (existingCode) {
        throw new ConflictError("Mã khuyến mãi này đã tồn tại trong thương hiệu của bạn");
    }

    const newPromotionData = {
        ...data,
        brandId,
        valid_from: new Date(data.valid_from),
        valid_until: new Date(data.valid_until)
    };

    const promotion = await createPromotionRepo(newPromotionData);
    return promotion;
};
