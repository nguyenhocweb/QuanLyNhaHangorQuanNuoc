import { Router } from "express";

// --- MIDDLEWARES ---
import { authenticateToken } from "../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../core/middlewares/authorizeRole.middleware.js";

// --- ROLE-BASED ROUTERS (HUBS) ---
import publicRouter from "./public/public.router.js";
import customerRouter from "./customer/customer.router.js";
import brandOwnerRouter from "./brand_owner/brand_owner.router.js";
import restaurantManagerRouter from "./restaurant_manager/restaurant_manager.router.js";
import systemAdminRouter from "./system_admin/system_admin.router.js";
import sharedUserRouter from "./customer/profile/user.router.js";

import cloudinaryRouter from "./shared/cloudinary/router.cloudinary/index.js";

const route = Router();

// ==========================================
// 1. PUBLIC API (Không cần đăng nhập)
// ==========================================
route.use("/", publicRouter);
route.use("/cloudinary", cloudinaryRouter);

// ==========================================
// 1.5. GLOBAL SHARED USER API (Yêu cầu đăng nhập, cho mọi role)
// ==========================================
route.use("/user", authenticateToken, sharedUserRouter);

// ==========================================
// 2. TÀI KHOẢN KHÁCH HÀNG (Yêu cầu đăng nhập, Role: Khách hàng)
// ==========================================
// Chú ý: Vì nhiều router con bên trong customer cần JWT, ta gắn authenticateToken
// Nếu có role Khách hàng thì thêm authorizeRole("Khách hàng")
route.use(
    "/customer",
    authenticateToken,
    authorizeRole("Khách hàng", "Admin"),
    customerRouter
);

// ==========================================
// 3. QUẢN LÝ THƯƠNG HIỆU (Yêu cầu đăng nhập, Role: Quản lý thương hiệu, Quản lý thương hiệu)
// ==========================================
route.use(
    "/brand-owner",
    authenticateToken,
    authorizeRole("Quản lý thương hiệu", "Quản lý thương hiệu", "Admin"),
    brandOwnerRouter
);

// ==========================================
// 4. QUẢN LÝ NHÀ HÀNG (Yêu cầu đăng nhập, Role: Quản lý nhà hàng)
// ==========================================
route.use(
    "/restaurant-manager",
    authenticateToken,
    authorizeRole("Quản lý nhà hàng", "Admin", "Quản lý thương hiệu", "Quản lý thương hiệu"),
    restaurantManagerRouter
);

// ==========================================
// 5. SYSTEM ADMIN (Yêu cầu đăng nhập, Role: Admin)
// ==========================================
route.use(
    "/system-admin",
    authenticateToken,
    authorizeRole("Admin"),
    systemAdminRouter
);

export default route;