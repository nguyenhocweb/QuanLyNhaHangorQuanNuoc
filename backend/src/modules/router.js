import { Router } from "express";
import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import brandRouter from "./brand/route.brand.js";
import restaurantRouter from "./restaurant/route.restaurant.js";
import dishRouter from "./dish/route.dish.js"
import {authenticateToken} from "../core/middlewares/authenticateToken.js";
const route = Router();
route.use("/auth",authRouter);
route.use("/user",authenticateToken,userRouter);
route.use("/brand",brandRouter);
route.use("/restaurant",restaurantRouter);
route.use("/dish",dishRouter);
export default route;