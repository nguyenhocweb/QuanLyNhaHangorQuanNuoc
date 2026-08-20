import { prisma } from "../../databases/init.mongodb.js";
import { ForbiddenError } from "../constants/error/index.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware kiểm tra tính năng (Feature Enforcement)
 * Bắt buộc đặt sau `authenticateToken`.
 *
 * @param {string} requiredFeature - Mã tính năng cần kiểm tra (VD: 'INVENTORY_MANAGEMENT')
 */
export const requireFeature = (requiredFeature) => {
    return asyncHandler(async (req, res, next) => {
        // Bỏ qua kiểm tra nếu là System Admin
        if (req.user.role === 'Admin') {
            return next();
        }

        const brandId = req.user.brandId;
        if (!brandId) {
            throw new ForbiddenError("Không tìm thấy thông tin Brand của người dùng.");
        }

        // Tìm gói cước đang ACTIVE của Brand
        const activeSubscription = await prisma.brandSubscription.findFirst({
            where: {
                brandId: brandId,
                status: 'ACTIVE'
            },
            include: {
                plan: true
            }
        });

        if (!activeSubscription || !activeSubscription.plan) {
            throw new ForbiddenError("Thương hiệu chưa đăng ký gói cước nào. Vui lòng nâng cấp để sử dụng tính năng này.");
        }

        const featuresData = activeSubscription.plan.featuresData;

        // Nếu gói cước không có featuresData (gói quá cũ chưa được migrate) hoặc tính năng không được bật
        if (!featuresData || featuresData[requiredFeature] !== true) {
            throw new ForbiddenError(`Gói cước hiện tại không hỗ trợ tính năng: ${requiredFeature}. Vui lòng nâng cấp gói cước.`);
        }

        // Vượt qua kiểm tra
        next();
    });
};
