import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { authorizePermission } from "../../../core/middlewares/authorizePermission.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { areaCreateValidator } from "./validators/area.create.validator.js";
import { areaUpdateValidator } from "./validators/area.update.validator.js";

import { createArea } from "./controllers/area.create.controller.js";
import { getAreasByRestaurantId, getAreaById } from "./controllers/area.get.controller.js";
import { updateArea } from "./controllers/area.update.controller.js";
import { deleteArea } from "./controllers/area.delete.controller.js";

const route = Router({ mergeParams: true });

route.use(authenticateToken);

const viewAuth = authorizePermission("VIEW_TABLES", "MANAGE_TABLES");
const manageAuth = authorizePermission("MANAGE_TABLES");

route.post("/", manageAuth, validate(areaCreateValidator), createArea);
route.get("/restaurant/:restaurantId", viewAuth, getAreasByRestaurantId);
route.get("/:id", viewAuth, getAreaById);
route.put("/:id", manageAuth, validate(areaUpdateValidator), updateArea);
route.delete("/:id", manageAuth, deleteArea);

export default route;
