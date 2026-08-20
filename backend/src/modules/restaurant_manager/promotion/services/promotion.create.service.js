import { ConflictError } from "../../../../core/constants/error/index.js";
import { createPromotionRepo, findPromotionByCodeRepo } from "../repositories/promotion.create.repo.js";

export const createPromotionService = async (payload) => {
    // 1. Kiểm tra mã khuyến mãi đã tồn tại chưa
    const existingPromotion = await findPromotionByCodeRepo(payload.code);
    if (existingPromotion) {
        throw new ConflictError("Mã khuyến mãi đã tồn tại trong hệ thống");
    }

    // 2. Format dữ liệu ngày nếu cần
    if (payload.validFrom) payload.validFrom = new Date(payload.validFrom);
    if (payload.validUntil) payload.validUntil = new Date(payload.validUntil);

    // 3. Xử lý string rỗng của timeStart/timeEnd thành null nếu có
    if (payload.timeStart === "") payload.timeStart = null;
    if (payload.timeEnd === "") payload.timeEnd = null;

    // 3.5. Tự động lấy brandId từ nhà hàng hiện tại
    if (payload.restaurantId) {
        const { prisma } = await import("../../../../databases/init.mongodb.js");
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: payload.restaurantId },
            select: { brandId: true }
        });
        if (restaurant && restaurant.brandId) {
            payload.brandId = restaurant.brandId;
        }
    }

    // 4. Lưu vào DB
    const newPromotion = await createPromotionRepo(payload);

    return newPromotion;
};
