import { Router } from "express";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { checkoutController } from "./controllers/subscription.checkout.controller.js";
import { getActivePlans } from "./controllers/subscription.getPlans.controller.js";

// { mergeParams: true } để có thể lấy req.params.id_brand từ router cha
const route = Router({ mergeParams: true });

// Lấy danh sách các gói cước đang mở bán
route.get("/plans", asyncHandler(getActivePlans));

// Tạo link thanh toán mua gói cước
route.post("/checkout", asyncHandler(checkoutController.createCheckoutSession));

export default route;
