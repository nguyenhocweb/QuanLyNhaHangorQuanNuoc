import {Router} from "express"
import {authenticateToken} from "../../../../core/middlewares/authenticateToken.js"
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createReservationController } from "../reservation.controller/CreateReservation.controller.js";
import { getReservationHistoryController } from "../reservation.controller/GetReservationHistory.controller.js";
import { cancelReservationController } from "../reservation.controller/CancelReservation.controller.js";

const route = Router();

route.post("", authenticateToken, asyncHandler(createReservationController));
route.get("", authenticateToken, asyncHandler(getReservationHistoryController));
route.patch("/:id/cancel", authenticateToken, asyncHandler(cancelReservationController));

export default route;