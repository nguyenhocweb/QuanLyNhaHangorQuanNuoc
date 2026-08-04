import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import * as getController from "./controllers/promotion.get.controller.js";
import * as createController from "./controllers/promotion.create.controller.js";
import * as updateController from "./controllers/promotion.update.controller.js";
import * as deleteController from "./controllers/promotion.delete.controller.js";

import { createPromotionSchema, updatePromotionSchema } from "./validators/promotion.validator.js";

const route = Router({ mergeParams: true });

route.get("/", authenticateToken, getController.getPromotions);
route.post("/", authenticateToken, validate(createPromotionSchema), createController.createPromotion);
route.put("/:id_promotion", authenticateToken, validate(updatePromotionSchema), updateController.updatePromotion);
route.delete("/:id_promotion", authenticateToken, deleteController.deletePromotion);

export default route;
