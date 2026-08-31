import { ForbiddenError } from "../constants/error/index.js";

/**
 * Middleware kiểm tra quyền truy cập dựa trên role
 * @param {...string} allowedRoles - Danh sách các role được phép truy cập (VD: 'Admin', 'Quản lý thương hiệu', 'Quản lý nhà hàng', 'Nhân viên')
 */
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ForbiddenError("Bạn không có quyền truy cập (Không tìm thấy thông tin xác thực)");
        }

        // 1. Global Role
        const globalRole = req.user.systemRole 
            ? (typeof req.user.systemRole === 'object' ? req.user.systemRole.name : req.user.systemRole)
            : (typeof req.user.role === 'object' ? req.user.role.name : req.user.role);

        // Nếu allowedRoles chứa 'Admin' và user là Admin -> pass
        if (globalRole === 'Admin' && allowedRoles.includes('Admin')) {
            return next();
        }

        // Nếu allowedRoles chứa 'Khách hàng' và user là Khách hàng -> pass
        if (globalRole === 'Khách hàng' && allowedRoles.includes('Khách hàng')) {
            return next();
        }

        // Thu thập tất cả roles mà user đang nắm giữ
        const userRoles = new Set();
        if (globalRole) userRoles.add(globalRole);

        if (req.user.brand) {
            if (Array.isArray(req.user.brand)) {
                req.user.brand.forEach(b => b.role && userRoles.add(b.role));
            } else if (typeof req.user.brand === 'object' && req.user.brand.role) {
                userRoles.add(req.user.brand.role);
            }
        }

        if (req.user.restaurant) {
            if (Array.isArray(req.user.restaurant)) {
                req.user.restaurant.forEach(r => r.role && userRoles.add(r.role));
            } else if (typeof req.user.restaurant === 'object' && req.user.restaurant.role) {
                userRoles.add(req.user.restaurant.role);
            }
        }

        // Kiểm tra xem user có ít nhất một role nằm trong allowedRoles hay không
        const hasMatchingRole = allowedRoles.some(role => userRoles.has(role));

        if (!hasMatchingRole) {
            throw new ForbiddenError(`Bạn không có quyền truy cập. Yêu cầu quyền: ${allowedRoles.join(', ')}`);
        }

        // Nếu có truyền workspaceId (qua header x-workspace-id, query, hoặc params) thì kiểm tra quyền hạn tại workspace đó
        const workspaceId = req.headers['x-workspace-id'] || req.query.restaurantId || req.query.brandId || req.params.restaurantId || req.params.brandId;
        
        if (workspaceId && !userRoles.has('Admin')) {
            let hasWorkspaceAccess = false;

            if (req.user.brand) {
                if (Array.isArray(req.user.brand)) {
                    hasWorkspaceAccess = req.user.brand.some(b => b.id === workspaceId && allowedRoles.includes(b.role));
                } else if (typeof req.user.brand === 'object') {
                    hasWorkspaceAccess = (req.user.brand.id === workspaceId && allowedRoles.includes(req.user.brand.role));
                }
            }

            if (!hasWorkspaceAccess && req.user.restaurant) {
                if (Array.isArray(req.user.restaurant)) {
                    hasWorkspaceAccess = req.user.restaurant.some(r => r.id === workspaceId && allowedRoles.includes(r.role));
                } else if (typeof req.user.restaurant === 'object') {
                    hasWorkspaceAccess = (req.user.restaurant.id === workspaceId && allowedRoles.includes(req.user.restaurant.role));
                }
            }

            // Nếu user có role hợp lệ chung nhưng không khớp ID cụ thể, vẫn cho phép nếu là Quản lý
            if (!hasWorkspaceAccess && (userRoles.has("Quản lý thương hiệu") || userRoles.has("Quản lý nhà hàng"))) {
                hasWorkspaceAccess = true;
            }

            if (!hasWorkspaceAccess) {
                throw new ForbiddenError(`Bạn không có quyền truy cập không gian này. Yêu cầu quyền: ${allowedRoles.join(', ')}`);
            }
        }

        return next();
    };
};
