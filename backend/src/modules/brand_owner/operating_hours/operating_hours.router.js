import { Router } from "express";
import { getOperatingHoursController } from "./controllers/operating_hours.get.controller.js";
import { upsertOperatingHoursController } from "./controllers/operating_hours.upsert.controller.js";
import { upsertOperatingHoursValidator } from "./validators/operating_hours.upsert.validator.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

const route = Router({ mergeParams: true });

// Route get operating hours cho 1 restaurant (idRestaurant lấy từ param cha hoặc truyền thẳng)
route.get("/:idRestaurant", getOperatingHoursController.get);

// Route upsert operating hours
route.put("/:idRestaurant", validate(upsertOperatingHoursValidator), upsertOperatingHoursController.upsert);

export default route;
