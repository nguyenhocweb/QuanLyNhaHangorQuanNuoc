import express from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { tableMaintenanceCreateValidator, tableMaintenanceUpdateValidator } from "./validators/table_maintenance.validator.js";
import { createTableMaintenanceController } from "./controllers/table_maintenance.create.controller.js";
import { getTableMaintenanceController } from "./controllers/table_maintenance.get.controller.js";
import { updateTableMaintenanceController } from "./controllers/table_maintenance.update.controller.js";
import { deleteTableMaintenanceController } from "./controllers/table_maintenance.delete.controller.js";

const route = express.Router({ mergeParams: true });

route.post("/", validate(tableMaintenanceCreateValidator), createTableMaintenanceController);
route.get("/", getTableMaintenanceController);
route.put("/:id", validate(tableMaintenanceUpdateValidator), updateTableMaintenanceController);
route.delete("/:id", deleteTableMaintenanceController);

export default route;
