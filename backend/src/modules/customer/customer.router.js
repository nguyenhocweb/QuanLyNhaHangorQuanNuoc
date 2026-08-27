import { Router } from "express";

import aiRouter from "./ai/ai.router.js";
import loyaltyRouter from "./loyalty/loyalty.router.js";
import userRouter from "./profile/user.router.js";
import promotionRouter from "./promotion/promotion.router.js";
import reviewRouter from "./review/review.router.js";
import notificationRouter from "../notifications/notification.router.js";

const route = Router();

route.use("/ai", aiRouter);
route.use("/loyalty", loyaltyRouter);
route.use("/user", userRouter);
route.use("/promotion", promotionRouter);
route.use("/review", reviewRouter);

// Customer notification
route.use("/notifications", notificationRouter);

export default route;
