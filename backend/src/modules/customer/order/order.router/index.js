import { Router } from "express";
import { authenticateToken } from "../../../../core/middlewares/authenticateToken.js";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getMyOrdersController } from "../order.controller/GetMyOrders.controller.js";
import { claimPointsController } from "../order.controller/ClaimPoints.controller.js";
import { createDineInOrderController } from "../order.controller/dine_in_order.create.controller.js";
import { getActiveOrderByReservationController } from "../order.controller/dine_in_order.get_by_reservation.controller.js";
import { createDineInOrderValidator } from "../order.validator/dine_in_order.create.validator.js";
import { getDineInOrderValidator } from "../order.validator/dine_in_order.get.validator.js";

const route = Router();

route.post("/dine-in", validate(createDineInOrderValidator), asyncHandler(createDineInOrderController));
route.get("/active-by-reservation/:reservationId", validate(getDineInOrderValidator), asyncHandler(getActiveOrderByReservationController));
route.post("/claim-points", authenticateToken, asyncHandler(claimPointsController));
route.get("", authenticateToken, asyncHandler(getMyOrdersController));

export default route;

