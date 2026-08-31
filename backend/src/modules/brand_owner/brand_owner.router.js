import { Router } from "express";

// --- GLOBAL ROUTES (Không phụ thuộc vào id_brand cụ thể) ---
import brandRouter from "./brand/brand.router.js";
import areaRouter from "./area/area.router.js";
import tableRouter from "./table/table.router.js";
import menuRouter from "./menu/brand_menu.router.js";
import aiRouter from "./ai/ai.router.js";

// --- WORKSPACE ROUTES (Phụ thuộc vào :id_brand) ---
import crmRouter from "./crm/crm.router.js";
import permissionRouter from "./permission/permission.router.js";
import userRouter from "./user/user.router.js";
import operatingHoursRouter from "./operating_hours/operating_hours.router.js";
import reviewRouter from "./review/review.router.js";
import employmentRouter from "./employment/employment.router.js";
import promotionRouter from "./promotion/promotion.router.js";
import reportRouter from "./report/report.router.js";
import restaurantRouter from "./restaurant/restaurant.router.js";
import purchaseOrderRouter from "./purchase_order/purchase_order.router.js";
import purchaseRequestRouter from "./purchase_request/purchaseRequest.router.js";
import stockCountRouter from "./stock_count/stock_count.router.js";
import stockTransferRouter from "./stock_transfer/stock_transfer.router.js";
import supplierRouter from "./supplier/supplier.router.js";
import invoiceRouter from "./invoice/invoice.router.js";
import subscriptionRouter from "./subscription/subscription.router.js";
import apiKeyRouter from "./api_key/api_key.router.js";
import aiChatboxRouter from "./ai_chatbox/ai_chatbox.router.js";
import aiModelRouter from "./ai_model/ai_model.router.js";
import paymentConfigRouter from "./payment_config/payment_config.router.js";

// Import Notification từ thư mục chung
import notificationRouter from "../notifications/notification.router.js";

const route = Router();

// 1. Gắn các Global Routes
route.use("/brand", brandRouter);
route.use("/area", areaRouter);
route.use("/table", tableRouter);
route.use("/menu", menuRouter);
route.use("/ai", aiRouter);

// 2. Gắn các Workspace Routes (có chứa :id_brand)
// Lưu ý: Các file con cần dùng `Router({ mergeParams: true })` để nhận được `id_brand`
route.use("/:id_brand/crm", crmRouter);
route.use("/:id_brand/permission", permissionRouter);
route.use("/:id_brand/user", userRouter);
route.use("/:id_brand/operating-hours", operatingHoursRouter);
route.use("/:id_brand/review", reviewRouter);
route.use("/:id_brand/employment", employmentRouter);
route.use("/:id_brand/promotion", promotionRouter);
route.use("/:id_brand/report", reportRouter);
route.use("/:id_brand/restaurant", restaurantRouter);
route.use("/:id_brand/purchase-order", purchaseOrderRouter);
route.use("/:id_brand/purchase-request", purchaseRequestRouter);
route.use("/:id_brand/stock-count", stockCountRouter);
route.use("/:id_brand/stock-transfer", stockTransferRouter);
route.use("/:id_brand/supplier", supplierRouter);
route.use("/:id_brand/invoice", invoiceRouter);
route.use("/:id_brand/subscription", subscriptionRouter);
route.use("/:id_brand/api-key", apiKeyRouter);
route.use("/:id_brand/ai-chatboxes", aiChatboxRouter);
route.use("/:id_brand/ai-models", aiModelRouter);
route.use("/:id_brand/payment-configs", paymentConfigRouter);

// Đặc biệt: Notifications
route.use("/:id_brand/notifications", (req, res, next) => {
    req.workspaceContext = "BRAND";
    req.brandId = req.params.id_brand;
    next();
}, notificationRouter);

export default route;
