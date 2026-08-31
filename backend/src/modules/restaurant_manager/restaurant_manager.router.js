import { Router } from "express";

import aiRouter from "./ai/ai.router.js";
import areaRouter from "./area/area.router.js";
import cashierRouter from "./cashier/cashier.router.js";
import crmRouter from "./crm/crm.router.js";
import requestsRouter from "./inventory/requests/requests.router.js";
import stocksRouter from "./inventory/stocks/stocks.router.js";
import stockCountsRouter from "./inventory/stock_counts/stock_counts.router.js";
import menuRouter from "./menu/menu.router.js";
import operatingHoursRouter from "./operating_hours/operating_hours.router.js";
import orderRouter from "./order/order.router.js";
import promotionRouter from "./promotion/promotion.router.js";
import reportRouter from "./report/report.router.js";
import reservationRouter from "./reservation/reservation.router.js";
import reviewRouter from "./review/review.router.js";
import staffRouter from "./staff/staff.router.js";
import tableRouter from "./table/table.router.js";
import tableMaintenanceRouter from "./table_maintenance/table_maintenance.router.js";
import notificationRouter from "../notifications/notification.router.js";

const route = Router();

// ==========================================
// 1. Direct Routes (URL dạng /api/v1/restaurant-manager/order?restaurantId=...)
// ==========================================
route.use("/ai", aiRouter);
route.use("/area", areaRouter);
route.use("/cashier", cashierRouter);
route.use("/crm", crmRouter);
route.use("/inventory-request", requestsRouter);
route.use("/inventory-stock", stocksRouter);
route.use("/inventory-stock-count", stockCountsRouter);
route.use("/inventory/requests", requestsRouter);
route.use("/menu", menuRouter);
route.use("/operating-hours", operatingHoursRouter);
route.use("/order", orderRouter);
route.use("/promotion", promotionRouter);
route.use("/report", reportRouter);
route.use("/reservation", reservationRouter);
route.use("/review", reviewRouter);
route.use("/staff", staffRouter);
route.use("/table", tableRouter);
route.use("/table-maintenance", tableMaintenanceRouter);
route.use("/notifications", (req, res, next) => {
    req.workspaceContext = "RESTAURANT";
    next();
}, notificationRouter);

// ==========================================
// 2. Parametric Routes (URL dạng /api/v1/restaurant-manager/:restaurantId/order)
// ==========================================
route.use("/:restaurantId/ai", aiRouter);
route.use("/:restaurantId/area", areaRouter);
route.use("/:restaurantId/cashier", cashierRouter);
route.use("/:restaurantId/crm", crmRouter);
route.use("/:restaurantId/inventory-request", requestsRouter);
route.use("/:restaurantId/inventory-stock", stocksRouter);
route.use("/:restaurantId/inventory-stock-count", stockCountsRouter);
route.use("/:restaurantId/inventory/requests", requestsRouter);
route.use("/:restaurantId/menu", menuRouter);
route.use("/:restaurantId/operating-hours", operatingHoursRouter);
route.use("/:restaurantId/order", orderRouter);
route.use("/:restaurantId/promotion", promotionRouter);
route.use("/:restaurantId/report", reportRouter);
route.use("/:restaurantId/reservation", reservationRouter);
route.use("/:restaurantId/review", reviewRouter);
route.use("/:restaurantId/staff", staffRouter);
route.use("/:restaurantId/table", tableRouter);
route.use("/:restaurantId/table-maintenance", tableMaintenanceRouter);
route.use("/:restaurantId/notifications", (req, res, next) => {
    req.workspaceContext = "RESTAURANT";
    req.restaurantId = req.params.restaurantId;
    next();
}, notificationRouter);

export default route;
