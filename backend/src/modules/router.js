import { Router } from "express";
import notificationRouter from "./notifications/notification.router.js";

// Public Modules
import authRouter from "./public/auth/auth.router.js";
import restaurantRouter from "./public/restaurant/route.restaurant.js";
import dishRouter from "./public/menu/route.dish.js";

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
import staffStockCountRouter from "./staff/inventory/stock_counts/stock_counts.router.js";

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
import brandOwnerSupplierRouter from "./brand_owner/supplier/supplier.router.js";
import brandOwnerInventoryItemRouter from "./brand_owner/inventory_item/inventory_item.router.js";
import brandOwnerPurchaseOrderRouter from "./brand_owner/purchase_order/purchase_order.router.js";
import brandOwnerPurchaseRequestRouter from "./brand_owner/purchase_request/purchaseRequest.router.js";
import brandOwnerStockCountRouter from "./brand_owner/stock_count/stock_count.router.js";
import brandOwnerStockTransferRouter from "./brand_owner/stock_transfer/stock_transfer.router.js";
import brandOwnerCrmRouter from "./brand_owner/crm/crm.router.js";
import brandOwnerInvoiceRouter from "./brand_owner/invoice/invoice.router.js";

import restaurantManagerTableRouter from "./restaurant_manager/table/table.router.js";
// ...

// ...
import restaurantManagerAreaRouter from "./restaurant_manager/area/area.router.js";
import restaurantManagerReservationRouter from "./restaurant_manager/reservation/reservation.router.js";
import restaurantManagerTableMaintenanceRouter from "./restaurant_manager/table_maintenance/table_maintenance.router.js";
import restaurantManagerMenuRouter from "./restaurant_manager/menu/menu.router.js";
import restaurantManagerStaffRouter from "./restaurant_manager/staff/staff.router.js";
import restaurantManagerOrderRouter from "./restaurant_manager/order/order.router.js";
import restaurantManagerOperatingHoursRouter from "./restaurant_manager/operating_hours/operating_hours.router.js";
import restaurantManagerStockCountRouter from "./restaurant_manager/inventory/stock_counts/stock_counts.router.js";
import restaurantManagerReportRouter from "./restaurant_manager/report/report.router.js";
import restaurantManagerPromotionRouter from "./restaurant_manager/promotion/promotion.router.js";
import restaurantManagerCrmRouter from "./restaurant_manager/crm/crm.router.js";
import restaurantManagerCashierRouter from "./restaurant_manager/cashier/cashier.router.js";
import restaurantManagerReviewRouter from "./restaurant_manager/review/review.router.js";

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
route.use("/customer/ai", authenticateToken, (await import("./customer/ai/ai.router.js")).default);
route.use("/customer/loyalty", (await import("./customer/loyalty/loyalty.router.js")).default);
route.use("/customer/notifications", authenticateToken, (req, res, next) => { req.workspaceContext = "CUSTOMER"; next(); }, notificationRouter);

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
route.use("/restaurant-manager/inventory/stock_counts", authenticateToken, restaurantManagerStockCountRouter);
route.use("/restaurant-manager/report", authenticateToken, restaurantManagerReportRouter);
route.use("/restaurant-manager/promotion", authenticateToken, restaurantManagerPromotionRouter);
route.use("/restaurant-manager/crm", authenticateToken, restaurantManagerCrmRouter);
route.use("/restaurant-manager/cashier", authenticateToken, restaurantManagerCashierRouter);
route.use("/restaurant-manager/review", authenticateToken, restaurantManagerReviewRouter);
route.use("/restaurant-manager/ai", authenticateToken, authorizeRole("Quản lý nhà hàng"), (await import("./restaurant_manager/ai/ai.router.js")).default);
route.use("/restaurant-manager/notifications", authenticateToken, authorizeRole("Quản lý nhà hàng"), (req, res, next) => { req.workspaceContext = "RESTAURANT"; next(); }, notificationRouter);

import managerStocksRouter from "./restaurant_manager/inventory/stocks/stocks.router.js";
import managerRequestsRouter from "./restaurant_manager/inventory/requests/requests.router.js";
route.use("/restaurant-manager/inventory/stocks", authenticateToken, managerStocksRouter);
route.use("/restaurant-manager/inventory/requests", authenticateToken, managerRequestsRouter);
route.use("/staff/inventory/stocks", authenticateToken, managerStocksRouter);

route.use("/staff/inventory/stock_counts", authenticateToken, staffStockCountRouter);
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
import adminPaymentConfigRouter from "./system_admin/admin_payment_config/admin_payment_config.router.js";
route.use("/system-admin/payment-configs", authenticateToken, authorizeRole('Admin'), adminPaymentConfigRouter);
route.use("/system-admin/amenity", authenticateToken, authorizeRole('Admin'), amenityRouter);
route.use("/system-admin/tag", systemAdminTagRouter);
route.use("/system-admin/review", authenticateToken, authorizeRole("Admin"), systemAdminReviewRouter);
route.use("/system-admin/template", systemAdminTemplateRouter); // Đã có authenticateToken bên trong file router nếu cần, hoặc để như bên dưới:

import systemApiKeyRouter from "./system_admin/api_key/api_key.router.js";
import systemAiModelRouter from "./system_admin/ai_model/ai_model.router.js";
import systemAiChatboxRouter from "./system_admin/ai_chatbox/ai_chatbox.router.js";
route.use("/system-admin/api-keys", authenticateToken, systemApiKeyRouter);
route.use("/system-admin/ai-models", authenticateToken, systemAiModelRouter);
route.use("/system-admin/ai-chatboxes", authenticateToken, systemAiChatboxRouter);
route.use("/system-admin/ai", authenticateToken, authorizeRole("Admin"), (await import("./system_admin/ai/ai.router.js")).default);
route.use("/system-admin/notifications", authenticateToken, authorizeRole("Admin"), (req, res, next) => { req.workspaceContext = "SYSTEM_ADMIN"; next(); }, notificationRouter);
// Note: public endpoint inside systemAiModelRouter (GET /active) doesn't strictly need Admin, but we can separate it or use it as is if they are logged in.
// Oh wait, route.use(authorizeRole(["Admin"])) is INSIDE ai_model.router.js for the admin routes.
// So putting authenticateToken here is correct.

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
route.use("/brand-owner/:id_brand/supplier", authenticateToken, brandOwnerSupplierRouter);
route.use("/brand-owner/:id_brand/inventory-item", authenticateToken, brandOwnerInventoryItemRouter);
route.use("/brand-owner/:id_brand/purchase-order", authenticateToken, brandOwnerPurchaseOrderRouter);
route.use("/brand-owner/:id_brand/stock-count", authenticateToken, brandOwnerStockCountRouter);
route.use("/brand-owner/:id_brand/stock-transfer", authenticateToken, brandOwnerStockTransferRouter);
route.use("/brand-owner/:id_brand/purchase-request", authenticateToken, brandOwnerPurchaseRequestRouter);
route.use("/brand-owner/:id_brand/crm", authenticateToken, brandOwnerCrmRouter);
route.use("/brand-owner/:id_brand/invoice", authenticateToken, brandOwnerInvoiceRouter);

import brandApiKeyRouter from "./brand_owner/api_key/api_key.router.js";
route.use("/brand-owner/:id_brand/api-key", authenticateToken, brandApiKeyRouter);
route.use("/brand-owner/ai", authenticateToken, authorizeRole("Chủ thương hiệu"), (await import("./brand_owner/ai/ai.router.js")).default);
route.use("/brand-owner/:id_brand/notifications", authenticateToken, authorizeRole("Chủ thương hiệu"), (req, res, next) => { req.workspaceContext = "BRAND"; req.brandId = req.params.id_brand; next(); }, notificationRouter);
// Global Notifications (Removed)

export default route;