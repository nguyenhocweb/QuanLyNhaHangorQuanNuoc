import { Router } from "express";

import aiRouter from "./ai/ai.router.js";
import loyaltyRouter from "./loyalty/loyalty.router.js";
import userRouter from "./profile/user.router.js";
import promotionRouter from "./promotion/promotion.router.js";
import reviewRouter from "./review/review.router.js";
import notificationRouter from "../notifications/notification.router.js";
import reservationRouter from "./reservation/reservation.router/index.js";
import orderRouter from "./order/order.router/index.js";
import invoiceRouter from "./invoice/invoice.router/index.js";

const route = Router();

route.use("/ai", aiRouter);
route.use("/loyalty", loyaltyRouter);
route.use("/user", userRouter);
route.use("/promotion", promotionRouter);
route.use("/review", reviewRouter);
route.use("/reservation", reservationRouter);
route.use("/order", orderRouter);
route.use("/invoice", invoiceRouter);

// Customer notification
route.use("/notifications", notificationRouter);

export default route;
