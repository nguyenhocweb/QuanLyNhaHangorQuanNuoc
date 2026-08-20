import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { requireFeature } from "../../../core/middlewares/requireFeature.middleware.js";
import { SUBSCRIPTION_FEATURES } from "../../../constants/subscription.constant.js";

import * as getController from "./controllers/promotion.get.controller.js";
import * as createController from "./controllers/promotion.create.controller.js";
import * as updateController from "./controllers/promotion.update.controller.js";
import * as deleteController from "./controllers/promotion.delete.controller.js";

import { createPromotionSchema, updatePromotionSchema } from "./validators/promotion.validator.js";

const route = Router({ mergeParams: true });

// Chỉ những Brand mua gói cước có tính năng Khuyến Mãi Nâng Cao mới được sử dụng CRUD Promotion
const requirePromoFeature = requireFeature(SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS);

route.get("/", authenticateToken, requirePromoFeature, getController.getPromotions);
route.get("/:id_promotion", authenticateToken, requirePromoFeature, getController.getPromotionById);
route.post("/", authenticateToken, requirePromoFeature, validate(createPromotionSchema), createController.createPromotion);
route.put("/:id_promotion", authenticateToken, requirePromoFeature, validate(updatePromotionSchema), updateController.updatePromotion);
route.delete("/:id_promotion", authenticateToken, requirePromoFeature, deleteController.deletePromotion);

export default route;
