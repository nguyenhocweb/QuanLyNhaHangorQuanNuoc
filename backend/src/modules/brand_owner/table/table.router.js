import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { tableCreateValidator } from "./validators/table.create.validator.js";
import { tableUpdateValidator } from "./validators/table.update.validator.js";
import { tableSaveLayoutValidator } from "./validators/table.saveLayout.validator.js";

import { createTable } from "./controllers/table.create.controller.js";
import { getTablesByAreaId, getTableById } from "./controllers/table.get.controller.js";
import { updateTable } from "./controllers/table.update.controller.js";
import { deleteTable } from "./controllers/table.delete.controller.js";
import { saveTableLayout } from "./controllers/table.saveLayout.controller.js";

const route = Router({ mergeParams: true });

route.use(authenticateToken);
route.use(authorizeRole("Chủ thương hiệu", "Quản lý thương hiệu"));

route.post("/", validate(tableCreateValidator), createTable);
route.post("/save-layout", validate(tableSaveLayoutValidator), saveTableLayout);
route.get("/area/:areaId", getTablesByAreaId);
route.get("/:id", getTableById);
route.put("/:id", validate(tableUpdateValidator), updateTable);
route.delete("/:id", deleteTable);

export default route;
