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

// Các route có :restaurantId
route.use("/:restaurantId/ai", aiRouter);
route.use("/:restaurantId/area", areaRouter);
route.use("/:restaurantId/cashier", cashierRouter);
route.use("/:restaurantId/crm", crmRouter);
route.use("/:restaurantId/inventory-request", requestsRouter);
route.use("/:restaurantId/inventory-stock", stocksRouter);
route.use("/:restaurantId/inventory-stock-count", stockCountsRouter);
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
