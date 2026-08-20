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
    if (!promotion.isActive || new Date(promotion.validUntil) < now) {
        throw new BadRequestError("Voucher này đã hết hạn hoặc không còn hiệu lực sử dụng");
    }

    // 3. Kiểm tra giới hạn lượt dùng nếu có
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
        throw new BadRequestError("Voucher này đã được nhận hoặc sử dụng hết lượt");
    }

    // 3.5 Kiểm tra tệp khách hàng (VIP/NEW_CUSTOMER)
    const targetAudience = promotion.conditions?.targetAudience || 'ALL';
    if (targetAudience !== 'ALL') {
        const { prisma } = await import('../../../../databases/init.mongodb.js');
        
        let customerTier = 'NEW';
        
        // Nếu promotion thuộc về toàn chuỗi (brand)
        if (!promotion.promotionRestaurants || promotion.promotionRestaurants.length === 0) {
            const brandCustomer = await prisma.brandCustomer.findFirst({
                where: { userId, brandId: promotion.brandId }
            });
            if (brandCustomer) customerTier = brandCustomer.tier;
        } else {
            // Nếu promotion của 1 nhà hàng cụ thể
            const restaurantId = promotion.promotionRestaurants[0].restaurantId;
            const restCustomer = await prisma.restaurantCustomer.findFirst({
                where: { userId, restaurantId }
            });
            if (restCustomer) customerTier = restCustomer.tier;
        }

        if (targetAudience === 'VIP' && customerTier !== 'VIP') {
            throw new BadRequestError("Voucher này chỉ dành riêng cho khách hàng VIP");
        }
        
        if (targetAudience === 'NEW_CUSTOMER' && customerTier !== 'NEW') {
            throw new BadRequestError("Voucher này chỉ dành cho khách hàng mới");
        }
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
