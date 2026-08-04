import { Router } from "express";

// Public Modules
import authRouter from "./public/auth/auth.router.js";
import restaurantRouter from "./public/restaurant/route.restaurant.js";
import dishRouter from "./public/menu/route.dish.js";
import aiRouter from "./public/ai/ai.router.js";
import publicAmenityRouter from "./public/amenity/amenity.router.js";

// Customer Modules
import userRouter from "./customer/profile/user.router.js";
import reservationRouter from "./customer/reservation/reservation.router/index.js";
import customerReviewRouter from "./customer/review/review.router.js";
import customerOrderRouter from "./customer/order/order.router/index.js";
import customerInvoiceRouter from "./customer/invoice/invoice.router/index.js";
import customerPromotionRouter from "./customer/promotion/promotion.router.js";

// Webhook Modules
import webhookRouter from "./public/webhook/webhook.router.js";

// Staff Modules
import tableRouter from "./staff/table/router.table/index.js";

// System Admin Modules
import publicBrandRouter from "./public/brand/brand.router.js";
import brandRouter from "./system_admin/brand/route.brand.js";
import dashboardRouter from "./system_admin/dashboard/dashboard.router.js";
import accountRouter from "./system_admin/account/account.router.js";
import categoryRouter from "./system_admin/category/category.router.js";
import systemRestaurantRouter from "./system_admin/restaurant/restaurant.router.js";
import subscriptionRouter from "./system_admin/subscription/subscription.router.js";
import paymentMethodRouter from "./system_admin/payment_method/payment_method.router.js";
import amenityRouter from "./system_admin/amenity/amenity.router.js";
import systemAdminTagRouter from "./system_admin/tag/tag.router.js";
import systemAdminReviewRouter from "./system_admin/review/review.router.js";
import systemAdminTemplateRouter from "./system_admin/template/template.router.js";

// Shared Modules
import cloudinaryRouter from "./shared/cloudinary/router.cloudinary/index.js";

// Brand Owner Modules
import brandOwnerRestaurantRouter from "./brand_owner/restaurant/restaurant.router.js";
import brandOwnerBrandRouter from "./brand_owner/brand/brand.router.js";
import brandOwnerMenuRouter from "./brand_owner/menu/brand_menu.router.js";
import brandOwnerPromotionRouter from "./brand_owner/promotion/promotion.router.js";
import brandOwnerReportRouter from "./brand_owner/report/report.router.js";
import brandOwnerReviewRouter from "./brand_owner/review/review.router.js";
import brandOwnerAreaRouter from "./brand_owner/area/area.router.js";
import brandOwnerTableRouter from "./brand_owner/table/table.router.js";
import brandOwnerEmploymentRouter from "./brand_owner/employment/employment.router.js";
import brandOwnerPermissionRouter from "./brand_owner/permission/permission.router.js";
import brandOwnerUserRouter from "./brand_owner/user/user.router.js";
import brandOwnerSubscriptionRouter from "./brand_owner/subscription/subscription.router.js";
import brandOwnerOperatingHoursRouter from "./brand_owner/operating_hours/operating_hours.router.js";

import restaurantManagerTableRouter from "./restaurant_manager/table/table.router.js";
import restaurantManagerAreaRouter from "./restaurant_manager/area/area.router.js";
import restaurantManagerReservationRouter from "./restaurant_manager/reservation/reservation.router.js";
import restaurantManagerTableMaintenanceRouter from "./restaurant_manager/table_maintenance/table_maintenance.router.js";
import restaurantManagerMenuRouter from "./restaurant_manager/menu/menu.router.js";
import restaurantManagerStaffRouter from "./restaurant_manager/staff/staff.router.js";
import restaurantManagerOrderRouter from "./restaurant_manager/order/order.router.js";
import restaurantManagerOperatingHoursRouter from "./restaurant_manager/operating_hours/operating_hours.router.js";

import { authenticateToken } from "../core/middlewares/authenticateToken.js";


import { authorizeRole } from "../core/middlewares/authorizeRole.middleware.js";

const route = Router();

//----------------------------------- ROUTER CỦA QUẢN TRỊ VIÊN ---------------------------------------------
const routeAdmin = Router();
// Các route khác của Admin
routeAdmin.use("/brand", brandRouter);
// routeAdmin.use("/dashboard", dashboardRouter);
routeAdmin.use("/account", accountRouter);
routeAdmin.use("/category", categoryRouter);
routeAdmin.use("/restaurant", systemRestaurantRouter);


import publicCategoryRouter from "./public/category/category.router.js";
import publicTagRouter from "./public/tag/tag.router.js";
import publicReviewRouter from "./public/review/review.router.js";

// Public Routes
route.use("/auth", authRouter);
route.use("/ai", aiRouter);
route.use("/restaurant", restaurantRouter);
route.use("/dish", dishRouter); 
route.use("/brand", publicBrandRouter);
route.use("/webhooks", webhookRouter);
route.use("/amenity", publicAmenityRouter);
route.use("/category", publicCategoryRouter);
route.use("/tag", publicTagRouter);
route.use("/review", publicReviewRouter);

// Customer Routes
route.use("/users", authenticateToken, userRouter);
route.use("/customer/reservation", reservationRouter);
route.use("/customer/order", authenticateToken, customerOrderRouter);
route.use("/customer/invoice", authenticateToken, customerInvoiceRouter);
route.use("/customer/review", customerReviewRouter);
route.use("/customer/promotion", authenticateToken, customerPromotionRouter);

// Staff Routes
route.use("/restaurant/:idRestaurant/table", tableRouter);
route.use("/restaurant-manager/table", restaurantManagerTableRouter);
route.use("/restaurant-manager/area", restaurantManagerAreaRouter);
route.use("/restaurant-manager/reservation", restaurantManagerReservationRouter);
route.use("/restaurant-manager/table-maintenance", restaurantManagerTableMaintenanceRouter);
route.use("/restaurant-manager/menu", restaurantManagerMenuRouter);
route.use("/restaurant-manager/staff", restaurantManagerStaffRouter);
route.use("/restaurant-manager/order", restaurantManagerOrderRouter);
route.use("/restaurant-manager/operating-hours", restaurantManagerOperatingHoursRouter);
import upgradeRequestRouter from "./system_admin/upgrade_request/upgradeRequest.router.js";


// Shared Routes
route.use("/cloudinary", authenticateToken, cloudinaryRouter);

// System Admin Routes
route.use("/system-admin/brand", authenticateToken, authorizeRole('Admin'), brandRouter);
route.use("/system-admin/dashboard", authenticateToken, authorizeRole('Admin'), dashboardRouter);
route.use("/system-admin/account", authenticateToken, authorizeRole('Admin'), accountRouter);
route.use("/system-admin/category", authenticateToken, authorizeRole('Admin'), categoryRouter);
route.use("/system-admin/restaurant", authenticateToken, authorizeRole('Admin'), systemRestaurantRouter);
route.use("/system-admin/subscription", authenticateToken, authorizeRole('Admin'), subscriptionRouter);
route.use("/system-admin/payment-method", authenticateToken, authorizeRole('Admin'), paymentMethodRouter);
route.use("/system-admin/upgrade-request", authenticateToken, authorizeRole('Admin'), upgradeRequestRouter);
route.use("/system-admin/amenity", authenticateToken, authorizeRole('Admin'), amenityRouter);
route.use("/system-admin/tag", systemAdminTagRouter);
route.use("/system-admin/review", authenticateToken, authorizeRole("Admin"), systemAdminReviewRouter);
route.use("/system-admin/template", systemAdminTemplateRouter); // Đã có authenticateToken bên trong file router nếu cần, hoặc để như bên dưới:

// Brand Owner Routes
route.use("/brand-owner/brand", brandOwnerBrandRouter);
route.use("/brand-owner/menu", authenticateToken, brandOwnerMenuRouter);
route.use("/brand-owner/area", brandOwnerAreaRouter);
route.use("/brand-owner/table", brandOwnerTableRouter);
route.use("/brand-owner/:id_brand/restaurant", brandOwnerRestaurantRouter);
route.use("/brand-owner/:id_brand/promotion", brandOwnerPromotionRouter);
route.use("/brand-owner/:id_brand/report", brandOwnerReportRouter);
route.use("/brand-owner/:id_brand/review", authenticateToken, brandOwnerReviewRouter);
route.use("/brand-owner/:id_brand/employment", authenticateToken, brandOwnerEmploymentRouter);
route.use("/brand-owner/:id_brand/permission", authenticateToken, brandOwnerPermissionRouter);
route.use("/brand-owner/:id_brand/user", authenticateToken, brandOwnerUserRouter);
route.use("/brand-owner/:id_brand/subscription", authenticateToken, brandOwnerSubscriptionRouter);
route.use("/brand-owner/:id_brand/operating-hours", authenticateToken, brandOwnerOperatingHoursRouter);

export default route;