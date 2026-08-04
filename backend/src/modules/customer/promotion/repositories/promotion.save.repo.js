import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Tìm kiếm promotion theo ID hoặc theo Code
 */
export const findPromotionByIdOrCodeRepo = async (identifier) => {
    // Nếu identifier có dạng 24 ký tự hex (ObjectId) thì thử tìm theo cả id và code
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    if (isObjectId) {
        const byId = await prisma.promotion.findUnique({
            where: { id: identifier }
        });
        if (byId) return byId;
    }

    // Nếu không tìm thấy theo id hoặc không phải ObjectId thì tìm theo code (chính xác, không phân biệt hoa thường)
    return await prisma.promotion.findFirst({
        where: {
            code: {
                equals: identifier,
                mode: "insensitive"
            }
        }
    });
};

/**
 * Kiểm tra xem khách hàng đã lưu voucher này chưa
 */
export const checkUserPromotionExistsRepo = async (userId, promotionId) => {
    return await prisma.userPromotion.findFirst({
        where: {
            userId,
            promotionId
        }
    });
};

/**
 * Tạo bản ghi lưu voucher vào ví user_promotions
 */
export const saveUserPromotionRepo = async (userId, promotionId) => {
    return await prisma.userPromotion.create({
        data: {
            userId,
            promotionId,
            isUsed: false
        }
    });
};
