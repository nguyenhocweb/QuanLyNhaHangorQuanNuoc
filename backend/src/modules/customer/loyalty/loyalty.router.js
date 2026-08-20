import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { getLoyaltyController } from "./controllers/loyalty.get.controller.js";

const route = Router();

route.use(authenticateToken);
route.use(authorizeRole("Khách hàng"));

// Lấy thông tin điểm và thẻ thành viên tổng quát
route.get("/", asyncHandler(getLoyaltyController.getMyLoyaltyInfo));

// Lấy lịch sử giao dịch tích/trừ điểm
route.get("/history", asyncHandler(getLoyaltyController.getMyLoyaltyHistory));

export default route;
