import express from 'express';

import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { authorizePermission } from "../../../core/middlewares/authorizePermission.middleware.js";
import { getAreasWithTablesController } from "./controllers/table.get.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { tableCreateValidator } from "./validators/table.create.validator.js";
import { tableUpdateValidator } from "./validators/table.update.validator.js";
import { tableSaveLayoutValidator } from "./validators/table.saveLayout.validator.js";
import { tableAvailabilityValidator } from "./validators/table.availability.validator.js";

import { createTable } from "./controllers/table.create.controller.js";
import { updateTable } from "./controllers/table.update.controller.js";
import { deleteTable } from "./controllers/table.delete.controller.js";
import { saveTableLayout } from "./controllers/table.saveLayout.controller.js";
import { holdTable } from "./controllers/table.hold.controller.js";
import { getTableAvailability } from "./controllers/table.availability.controller.js";
const route = express.Router({ mergeParams: true });

// Middleware xác thực JWT
route.use(authenticateToken);

// Lấy danh sách sơ đồ bàn (Yêu cầu quyền VIEW_TABLES hoặc Quản lý)
route.get(
    "/:restaurantId/areas-with-tables",
    // Yêu cầu quyền VIEW_TABLES hoặc MANAGE_TABLES (Quản lý mặc định được qua)
    authorizePermission('VIEW_TABLES', 'MANAGE_TABLES'),
    getAreasWithTablesController
);

// Lấy sơ đồ bàn kèm trạng thái (trống/bận) theo khung giờ
route.post(
    "/:restaurantId/availability",
    authorizePermission('VIEW_TABLES', 'MANAGE_TABLES', 'MANAGE_RESERVATIONS', 'VIEW_RESERVATIONS'),
    validate(tableAvailabilityValidator),
    getTableAvailability
);

// Quản lý Bàn (Yêu cầu quyền MANAGE_TABLES hoặc Quản lý/Admin)
const manageTableAuth = authorizePermission('MANAGE_TABLES');

route.post("/", manageTableAuth, validate(tableCreateValidator), createTable);
route.post("/save-layout", manageTableAuth, validate(tableSaveLayoutValidator), saveTableLayout);
route.post("/:id/hold", holdTable);
route.put("/:id", manageTableAuth, validate(tableUpdateValidator), updateTable);
route.delete("/:id", manageTableAuth, deleteTable);

export default route;
