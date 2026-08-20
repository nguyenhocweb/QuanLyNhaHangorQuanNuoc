import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { getPromotionByIdRepo } from "../repositories/promotion.get.repo.js";
import { updatePromotionRepo } from "../repositories/promotion.update.repo.js";
import { findPromotionByCodeRepo } from "../repositories/promotion.create.repo.js";

export const updatePromotionService = async (id, payload) => {
    // 1. Kiểm tra tồn tại
    const existingPromotion = await getPromotionByIdRepo(id);
    if (!existingPromotion) {
        throw new NotFoundError("Không tìm thấy khuyến mãi");
    }

    // 1.5. Phân quyền: Kiểm tra nhà hàng có quyền chỉnh sửa hay không
    if (payload.restaurantId) {
        if (existingPromotion.promotionRestaurants.length === 0) {
            throw new ConflictError("Khuyến mãi này được áp dụng cho toàn hệ thống Thương hiệu. Chi nhánh không có quyền chỉnh sửa.");
        }
        const hasPermission = existingPromotion.promotionRestaurants.some(
            pr => pr.restaurantId === payload.restaurantId
        );
        if (!hasPermission) {
            throw new ConflictError("Bạn không có quyền chỉnh sửa khuyến mãi của chi nhánh khác.");
        }
    }

    // 2. Kiểm tra trùng mã (nếu có đổi mã)
    if (payload.code && payload.code !== existingPromotion.code) {
        const checkCode = await findPromotionByCodeRepo(payload.code);
        if (checkCode) {
            throw new ConflictError("Mã khuyến mãi đã tồn tại trong hệ thống");
        }
    }

    // 3. Format dữ liệu ngày nếu có
    if (payload.validFrom) payload.validFrom = new Date(payload.validFrom);
    if (payload.validUntil) payload.validUntil = new Date(payload.validUntil);

    if (payload.timeStart === "") payload.timeStart = null;
    if (payload.timeEnd === "") payload.timeEnd = null;

    // 4. Update
    const updatedPromotion = await updatePromotionRepo(id, payload);

    return updatedPromotion;
};
