import { ForbiddenError } from "../constants/error/index.js";

/**
 * Middleware kiểm tra quyền truy cập dựa trên permission hoặc role
 * Cho phép nếu user có role là 'Quản lý nhà hàng', 'Quản lý thương hiệu', 'Admin'
 * HOẶC có chứa một trong các permission yêu cầu trong mảng req.user.permissions
 * @param {...string} requiredPermissions - Các Permission được phép (VD: 'VIEW_TABLES', 'MANAGE_TABLES')
 */
export const authorizePermission = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ForbiddenError("Bạn không có quyền truy cập (Không tìm thấy thông tin xác thực)");
        }

        const userRole = typeof req.user.role === 'object' ? req.user.role.name : req.user.role;
        const isAdminOrManager = ['Quản lý nhà hàng', 'Quản lý thương hiệu', 'Admin'].includes(userRole);

        if (isAdminOrManager) {
            return next();
        }

        // Kiểm tra quyền của nhân viên
        const userPermissions = req.user.permissions || [];
        const hasRequiredPermission = requiredPermissions.some(perm => userPermissions.includes(perm));
        
        if (hasRequiredPermission) {
            return next();
        }

        throw new ForbiddenError(`Bạn không có quyền truy cập. Yêu cầu một trong các quyền: ${requiredPermissions.join(', ')}`);
    };
};
