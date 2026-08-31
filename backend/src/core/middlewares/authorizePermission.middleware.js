import { ForbiddenError } from "../constants/error/index.js";

/**
 * Middleware kiểm tra quyền truy cập dựa trên permission hoặc role
 * Cho phép nếu user có role là 'Quản lý nhà hàng', 'Quản lý thương hiệu', 'Admin'
 * HOẶC có chứa một trong các permission yêu cầu trong mảng req.user.permissions
 * @param {...string} requiredPermissions - Các Permission được phép (VD: 'VIEW_TABLES', 'MANAGE_TABLES', 'VIEW_OPERATING_HOURS')
 */
export const authorizePermission = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ForbiddenError("Bạn không có quyền truy cập (Không tìm thấy thông tin xác thực)");
        }

        // Thu thập tất cả roles có thể có của user từ token payload
        const roles = new Set();

        // 1. Direct role
        if (req.user.role) {
            roles.add(typeof req.user.role === 'object' ? req.user.role.name : req.user.role);
        }

        // 2. System Role
        if (req.user.systemRole) {
            roles.add(typeof req.user.systemRole === 'object' ? req.user.systemRole.name : req.user.systemRole);
        }

        // 3. Brand Workspace Role
        if (req.user.brand) {
            if (Array.isArray(req.user.brand)) {
                req.user.brand.forEach(b => b.role && roles.add(b.role));
            } else if (typeof req.user.brand === 'object' && req.user.brand.role) {
                roles.add(req.user.brand.role);
            }
        }

        // 4. Restaurant Workspace Role
        if (req.user.restaurant) {
            if (Array.isArray(req.user.restaurant)) {
                req.user.restaurant.forEach(r => r.role && roles.add(r.role));
            } else if (typeof req.user.restaurant === 'object' && req.user.restaurant.role) {
                roles.add(req.user.restaurant.role);
            }
        }

        // Cấp quyền Admin, Quản lý thương hiệu, Quản lý nhà hàng truy cập toàn quyền
        const highLevelRoles = ['Admin', 'Quản lý thương hiệu', 'Quản lý nhà hàng'];
        const isManagerOrAdmin = highLevelRoles.some(role => roles.has(role));

        if (isManagerOrAdmin) {
            return next();
        }

        // Kiểm tra quyền của nhân viên
        const userPermissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
        const hasRequiredPermission = requiredPermissions.length === 0 || requiredPermissions.some(perm => userPermissions.includes(perm));
        
        if (hasRequiredPermission) {
            return next();
        }

        throw new ForbiddenError(`Bạn không có quyền truy cập. Yêu cầu một trong các quyền: ${requiredPermissions.join(', ')}`);
    };
};
