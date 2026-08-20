import { prisma } from "../../databases/init.mongodb.js";
import { ForbiddenError, NotFoundError } from "../constants/error/index.js";

/**
 * Tìm một API Key hợp lệ theo Loại (KeyType)
 * @param {string} keyType 
 * @returns {object|null}
 */
const findActiveKeyByType = async (keyType) => {
  return await prisma.apiKey.findFirst({
    where: {
      keyType,
      status: 'ACTIVE',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: { createdAt: 'desc' } // Ưu tiên key mới nhất
  });
};

/**
 * Phân luồng và trả về đúng API Key cho AI Agent dựa trên Ngữ cảnh người dùng
 * (Có tích hợp cơ chế Fallback)
 * @param {object} user - Object req.user từ middleware authenticateToken
 * @param {string} brandId - (Optional) ID của Thương hiệu đang gọi
 * @returns {object} API Key Record
 */
export const resolveAiKey = async (user, brandId = null) => {
  // 1. Luồng Khách vãng lai / Khách hàng
  if (!user || user.role === 'Khách hàng') {
    const customerKey = await findActiveKeyByType('CUSTOMER_AI');
    if (!customerKey) {
      throw new NotFoundError("Hệ thống AI dành cho Khách hàng hiện đang bảo trì (Thiếu API Key).");
    }
    return customerKey;
  }

  // 2. Luồng System Admin
  if (user.role === 'Admin' || user.role === 'SYSTEM') {
    const adminKey = await findActiveKeyByType('ADMIN_AI');
    if (!adminKey) {
      throw new NotFoundError("Chưa cấu hình API Key dành cho Admin.");
    }
    return adminKey;
  }

  // 3. Luồng Quản lý Thương hiệu / Quản lý Nhà hàng
  if (user.role === 'Quản lý thương hiệu' || user.role === 'Quản lý nhà hàng' || user.role === 'Nhân viên') {
    const targetBrandId = brandId || user.brandId;
    
    if (!targetBrandId) {
      throw new ForbiddenError("Không xác định được Thương hiệu để cấp phát AI.");
    }

    // 3.1 Ưu tiên 1: Lấy Key riêng của Brand (Do Brand tự nạp)
    const brandSpecificKey = await prisma.apiKey.findFirst({
      where: {
        keyType: 'BRAND_SPECIFIC',
        brandId: targetBrandId,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    if (brandSpecificKey) {
      return brandSpecificKey;
    }

    // 3.2 Ưu tiên 2 (Fallback): Không có Key riêng -> Xài ké Key chung của hệ thống (Do Admin cấp)
    const sharedKey = await findActiveKeyByType('BRAND_SHARED_AI');
    
    if (sharedKey) {
      // LOGIC MỞ RỘNG: Chỗ này trong tương lai cần gắn thêm Rate Limiting (Redis)
      // Để đếm số lượng token/request mà Brand này xài ké, tránh sập hầm tiền của Admin.
      console.warn(`[AI-ROUTING] Brand ${targetBrandId} đang xài Fallback Shared AI Key!`);
      return sharedKey;
    }

    // Nếu không có cả 2
    throw new NotFoundError("Thương hiệu chưa cấu hình API Key riêng và hệ thống cũng không có Key dự phòng. Vui lòng nạp API Key trong Cài đặt.");
  }

  throw new ForbiddenError("Quyền hạn không hợp lệ để sử dụng AI.");
};
