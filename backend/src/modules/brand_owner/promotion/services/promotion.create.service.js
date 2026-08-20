import { ConflictError, ForbiddenError } from "../../../../core/constants/error/index.js";
import { 
    createPromotionRepo, 
    checkCodeExistsRepo, 
    checkRestaurantsBelongToBrandRepo, 
    checkMenuItemsBelongToBrandRepo 
} from "../repositories/promotion.create.repo.js";

export const createPromotionService = async (brandId, data) => {
    // Check if code already exists for this brand
    const existingCode = await checkCodeExistsRepo(data.code, brandId);
    if (existingCode) {
        throw new ConflictError("Mã khuyến mãi này đã tồn tại trong hệ thống của bạn.");
    }

    // Cross-tenant validation
    if (data.restaurantIds && data.restaurantIds.length > 0) {
        const isValid = await checkRestaurantsBelongToBrandRepo(data.restaurantIds, brandId);
        if (!isValid) {
            throw new ForbiddenError("Lỗi bảo mật: Một hoặc nhiều nhà hàng không thuộc quyền sở hữu của thương hiệu này.");
        }
    }

    if (data.menuItemIds && data.menuItemIds.length > 0) {
        const isValid = await checkMenuItemsBelongToBrandRepo(data.menuItemIds, brandId);
        if (!isValid) {
            throw new ForbiddenError("Lỗi bảo mật: Một hoặc nhiều món ăn không thuộc quyền sở hữu của thương hiệu này.");
        }
    }

    const { targetAudience, isActive, ...restData } = data;

    const newPromotionData = {
        ...restData,
        brandId,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        status: isActive ? "ACTIVE" : "INACTIVE",
        conditions: targetAudience ? { targetAudience } : undefined
    };

    const promotion = await createPromotionRepo(newPromotionData);
    return promotion;
};
