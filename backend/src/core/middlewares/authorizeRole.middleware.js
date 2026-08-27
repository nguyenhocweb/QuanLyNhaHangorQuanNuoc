import { ForbiddenError } from "../constants/error/index.js";

/**
 * Middleware kiểm tra quyền truy cập dựa trên role
 * @param {...string} allowedRoles - Danh sách các role được phép truy cập (VD: 'Admin', 'Manager')
 */
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.systemRole) {
            throw new ForbiddenError("Bạn không có quyền truy cập (Không tìm thấy thông tin role)");
        }

        // Global Role
        const globalRole = typeof req.user.systemRole === 'object' ? req.user.systemRole.name : req.user.systemRole;

        // Nếu allowedRoles chứa 'Admin', ta check global role trước
        if (globalRole === 'Admin' && allowedRoles.includes('Admin')) {
            return next();
        }

        if (allowedRoles.includes(globalRole) && globalRole === 'Khách hàng') {
            return next();
        }

        // Với các role phụ thuộc workspace (Tenant Roles)
        const workspaceRoles = ["Quản lý thương hiệu", "Quản lý nhà hàng", "Nhân viên"];
        const requiresWorkspace = allowedRoles.some(role => workspaceRoles.includes(role));

        if (requiresWorkspace) {
            const workspaceId = req.headers['x-workspace-id'];
            
            if (!workspaceId) {
                throw new ForbiddenError(`Yêu cầu bắt buộc phải có x-workspace-id trong header để truy cập chức năng này.`);
            }

            // Tìm role của user tại workspace này
            let tenantRole = null;
            
            // Check trong brand
            if (req.user.brand && Array.isArray(req.user.brand)) {
                const brand = req.user.brand.find(b => b.id === workspaceId);
                if (brand && brand.role) {
                    tenantRole = brand.role;
                }
            }

            // Check trong restaurant
            if (!tenantRole && req.user.restaurant && Array.isArray(req.user.restaurant)) {
                const rest = req.user.restaurant.find(r => r.id === workspaceId);
                if (rest && rest.role) {
                    tenantRole = rest.role;
                }
            }

            // Nếu không tìm thấy role cụ thể cho workspace này, hoặc role không nằm trong allowedRoles
            if (!tenantRole || !allowedRoles.includes(tenantRole)) {
                throw new ForbiddenError(`Bạn không có quyền truy cập không gian này. Yêu cầu quyền: ${allowedRoles.join(', ')}`);
            }

            return next();
        }

        // Nếu không yêu cầu workspace role, check globalRole
        if (!allowedRoles.includes(globalRole)) {
            throw new ForbiddenError(`Bạn không có quyền truy cập. Yêu cầu quyền: ${allowedRoles.join(', ')}`);
        }

        next();
    };
};
