import { prisma } from "../../databases/init.mongodb.js";
import { hashApiKey } from "../utils/apiKey.utils.js";
import { UnauthorizedError, ForbiddenError } from "../constants/error/index.js";

/**
 * Middleware để xác thực API Key
 * Yêu cầu client truyền Header: x-api-key
 * @param {string} requiredType (Optional) Loại Key cần có (VD: 'ADMIN_AI', 'BRAND_SPECIFIC')
 */
export const verifyApiKey = (requiredType = null) => {
  return async (req, res, next) => {
    try {
      const apiKeyPlain = req.headers['x-api-key'];

      if (!apiKeyPlain) {
        throw new UnauthorizedError("Thiếu API Key (x-api-key header)");
      }

      // Hash key nhận được để so khớp DB
      const keyHash = hashApiKey(apiKeyPlain);

      // Tìm Key trong DB
      const apiKeyInfo = await prisma.apiKey.findUnique({
        where: { keyHash }
      });

      if (!apiKeyInfo) {
        throw new UnauthorizedError("API Key không hợp lệ");
      }

      // Kiểm tra trạng thái
      if (apiKeyInfo.status === "REVOKED") {
        throw new ForbiddenError("API Key này đã bị thu hồi");
      }
      
      if (apiKeyInfo.status === "EXPIRED" || (apiKeyInfo.expiresAt && new Date() > new Date(apiKeyInfo.expiresAt))) {
        throw new ForbiddenError("API Key đã hết hạn");
      }

      if (requiredType && apiKeyInfo.keyType !== requiredType) {
        throw new ForbiddenError(`API Key không hợp lệ. Yêu cầu loại Key: ${requiredType}`);
      }

      // Gắn context vào Request
      req.apiContext = {
        apiKeyId: apiKeyInfo.id,
        brandId: apiKeyInfo.brandId,
        keyType: apiKeyInfo.keyType,
        name: apiKeyInfo.name
      };

      // Cập nhật lastUsedAt và lastIp ngầm (không dùng await để tránh block luồng chính)
      prisma.apiKey.update({
        where: { id: apiKeyInfo.id },
        data: { 
          lastUsedAt: new Date(),
          lastIp: req.ip || req.connection?.remoteAddress
        }
      }).catch(err => console.error("Lỗi cập nhật lastUsedAt API Key:", err));

      next();
    } catch (error) {
      next(error);
    }
  };
};
