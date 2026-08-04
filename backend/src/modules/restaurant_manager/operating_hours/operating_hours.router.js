import { Router } from "express";
import { getOperatingHoursController } from "./controllers/operating_hours.get.controller.js";
import { upsertOperatingHoursController } from "./controllers/operating_hours.upsert.controller.js";
import { upsertOperatingHoursValidator } from "../../brand_owner/operating_hours/validators/operating_hours.upsert.validator.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizePermission } from "../../../core/middlewares/authorizePermission.middleware.js";

const route = Router({ mergeParams: true });

route.use(authenticateToken);

// GET: Yêu cầu quyền VIEW_OPERATING_HOURS
route.get("/", authorizePermission("VIEW_OPERATING_HOURS"), getOperatingHoursController);

// PUT: Yêu cầu quyền UPDATE_OPERATING_HOURS
route.put("/", authorizePermission("UPDATE_OPERATING_HOURS"), validate(upsertOperatingHoursValidator), upsertOperatingHoursController);

export default route;
