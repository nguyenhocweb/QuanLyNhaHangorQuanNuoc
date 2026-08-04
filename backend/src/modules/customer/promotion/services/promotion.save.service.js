import { 
    findPromotionByIdOrCodeRepo, 
    checkUserPromotionExistsRepo, 
    saveUserPromotionRepo 
} from "../repositories/promotion.save.repo.js";
import { NotFoundError, BadRequestError, ConflictError } from "../../../../core/constants/error/index.js";

export const saveVoucherService = async (userId, identifier) => {
    // 1. Tìm promotion theo ID hoặc Code
    const promotion = await findPromotionByIdOrCodeRepo(identifier);
    if (!promotion) {
        throw new NotFoundError("Mã khuyến mãi hoặc voucher không tồn tại trên hệ thống");
    }

    // 2. Kiểm tra hiệu lực của voucher
    const now = new Date();
    if (!promotion.isActive || new Date(promotion.valid_until) < now) {
        throw new BadRequestError("Voucher này đã hết hạn hoặc không còn hiệu lực sử dụng");
    }

    // 3. Kiểm tra giới hạn lượt dùng nếu có
    if (promotion.usage_limit && promotion.used_count >= promotion.usage_limit) {
        throw new BadRequestError("Voucher này đã được nhận hoặc sử dụng hết lượt");
    }

    // 4. Kiểm tra xem khách hàng đã lưu voucher này chưa
    const existing = await checkUserPromotionExistsRepo(userId, promotion.id);
    if (existing) {
        throw new ConflictError("Bạn đã lưu voucher này vào ví trước đó rồi");
    }

    // 5. Lưu vào ví
    const savedRecord = await saveUserPromotionRepo(userId, promotion.id);

    return {
        id: savedRecord.id,
        promotionId: promotion.id,
        code: promotion.code,
        savedAt: savedRecord.savedAt
    };
};
