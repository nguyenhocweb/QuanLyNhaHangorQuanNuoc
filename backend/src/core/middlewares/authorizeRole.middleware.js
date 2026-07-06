import { ForbiddenError } from "../constants/error/index.js";

/**
 * Middleware kiểm tra quyền truy cập dựa trên role
 * @param {...string} allowedRoles - Danh sách các role được phép truy cập (VD: 'Admin', 'Manager')
 */
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ForbiddenError("Bạn không có quyền truy cập (Không tìm thấy thông tin role)");
        }

        // Lấy role từ payload của JWT (tuỳ thuộc vào cấu trúc payload lúc sign token)
        const userRole = typeof req.user.role === 'object' ? req.user.role.name : req.user.role;

        if (!allowedRoles.includes(userRole)) {
            throw new ForbiddenError(`Bạn không có quyền truy cập. Yêu cầu quyền: ${allowedRoles.join(', ')}`);
        }

        next();
    };
};
