import {Router} from "express"
import {authenticateToken} from "../../../../core/middlewares/authenticateToken.js"
import { createReservationController } from "../reservation.controller/CreateReservation.controller.js";
const route=Router();

route.post("",authenticateToken,createReservationController)
export default route