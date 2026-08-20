import { Router } from "express";
import { authenticateToken } from "../../../../core/middlewares/authenticateToken.js";
import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getMyOrdersController } from "../order.controller/GetMyOrders.controller.js";
import { claimPointsController } from "../order.controller/ClaimPoints.controller.js";

const route = Router();

route.post("/claim-points", authenticateToken, asyncHandler(claimPointsController));
route.get("", authenticateToken, asyncHandler(getMyOrdersController));

export default route;
