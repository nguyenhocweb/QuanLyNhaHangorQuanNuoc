import { Router } from "express";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { checkoutController } from "./controllers/subscription.checkout.controller.js";

// { mergeParams: true } để có thể lấy req.params.id_brand từ router cha
const route = Router({ mergeParams: true });

// Tạo link thanh toán mua gói cước
route.post("/checkout", asyncHandler(checkoutController.createCheckoutSession));

export default route;
