import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { getBrandController } from "./controllers/brand.get.controller.js";
import { getBrandTemplatesController } from "./controllers/brand_templates.get.controller.js";
import { updateBrandController } from "./controllers/brand.update.controller.js";
import { updateBrandValidator } from "./validators/brand.update.validator.js";

import { getBrandRestaurantsController } from "./controllers/brand_restaurants.get.controller.js";
import { getBrandSubscriptionController } from "./controllers/brand_subscription.get.controller.js";
import { createPaymentController } from "./controllers/brand_subscription.create_payment.controller.js";
import { checkPaymentStatusController } from "./controllers/brand_subscription_transaction.check_status.controller.js";
import { getSubscriptionPlansController } from "./controllers/subscription_plan.get.controller.js";
import { createPaymentValidator } from "./validators/brand_subscription.create_payment.validator.js";

import { updateBrandTemplateController } from "./controllers/brand.update_template.controller.js";
import { updateBrandTemplateValidator } from "./validators/brand.update_template.validator.js";

const route = Router({ mergeParams: true });

// Middleware áp dụng cho tất cả route bên dưới
route.use(authenticateToken);
// "Quản lý thương hiệu" or "Quản lý thương hiệu" role is required
route.use(authorizeRole("Quản lý thương hiệu", "Quản lý thương hiệu"));

route.get("/", asyncHandler(getBrandController));
route.get("/templates", asyncHandler(getBrandTemplatesController));
route.get("/restaurants", asyncHandler(getBrandRestaurantsController));
route.get("/subscription", asyncHandler(getBrandSubscriptionController));
route.get("/subscription/plans", getSubscriptionPlansController);
route.get("/subscription/check-payment-status/:transactionId", checkPaymentStatusController);
route.post("/subscription/create-payment", validate(createPaymentValidator), createPaymentController);

route.put("/", validate(updateBrandValidator), asyncHandler(updateBrandController));
route.put("/template", validate(updateBrandTemplateValidator), updateBrandTemplateController);

export default route;
