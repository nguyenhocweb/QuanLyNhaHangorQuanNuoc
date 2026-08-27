import express from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { checkoutSchema } from "./validators/cashier.checkout.validator.js";
import { processCheckout } from "./controllers/cashier.checkout.controller.js";

const route = express.Router({ mergeParams: true });

// POST /api/v1/restaurant_manager/cashier/checkout
route.post("/checkout", validate(checkoutSchema), asyncHandler(processCheckout));

export default route;
