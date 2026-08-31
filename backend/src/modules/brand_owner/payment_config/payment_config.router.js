import express from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getBrandPaymentConfigsController } from "./controllers/payment_config.get.controller.js";
import { upsertBrandPaymentConfigController } from "./controllers/payment_config.upsert.controller.js";
import { upsertBrandPaymentConfigValidator } from "./validators/payment_config.upsert.validator.js";

import { createBrandPaymentMethodController } from "./controllers/payment_method.create.controller.js";
import { createPaymentMethodValidator } from "./validators/payment_method.create.validator.js";

const route = express.Router({ mergeParams: true });

// GET all payment methods + configs for Brand
route.get("/", asyncHandler(getBrandPaymentConfigsController));

// POST Create new payment method
route.post(
    "/",
    validate(createPaymentMethodValidator),
    asyncHandler(createBrandPaymentMethodController)
);

// POST / UPSERT config for a specific method
route.post(
    "/:systemPaymentMethodId",
    validate(upsertBrandPaymentConfigValidator),
    asyncHandler(upsertBrandPaymentConfigController)
);

export default route;
