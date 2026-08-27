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

        let brandId = req.params.id_brand || req.body.brandId || req.query.brandId;

        // Nếu không có trực tiếp brandId, ta kiểm tra qua x-workspace-id
        if (!brandId) {
            const workspaceId = req.headers['x-workspace-id'];
            if (workspaceId) {
                if (req.user.brand && req.user.brand.some(b => b.id === workspaceId)) {
                    brandId = workspaceId;
                } else if (req.user.restaurant && req.user.restaurant.some(r => r.id === workspaceId)) {
                    const restaurant = await prisma.restaurant.findUnique({
                        where: { id: workspaceId },
                        select: { brandId: true }
                    });
                    if (restaurant) brandId = restaurant.brandId;
                } else {
                    brandId = workspaceId; // Fallback
                }
            }
        }

        if (!brandId) {
            throw new ForbiddenError("Không tìm thấy thông tin Brand của người dùng để kiểm tra tính năng.");
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
