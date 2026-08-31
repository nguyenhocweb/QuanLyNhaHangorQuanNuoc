import { Router } from "express";

import aiRouter from "./ai/ai.router.js";
import amenityRouter from "./amenity/amenity.router.js";
import authRouter from "./auth/auth.router.js";
import brandRouter from "./brand/brand.router.js";
import categoryRouter from "./category/category.router.js";
import restaurantRouter from "./restaurant/route.restaurant.js";
import reviewRouter from "./review/review.router.js";
import tagRouter from "./tag/tag.router.js";
import webhookRouter from "./webhook/webhook.router.js";
import dishRouter from "./menu/route.dish.js";

const route = Router();

route.use("/ai", aiRouter);
route.use("/amenity", amenityRouter);
route.use("/auth", authRouter);
route.use("/brand", brandRouter);
route.use("/category", categoryRouter);
route.use("/restaurant", restaurantRouter);
route.use("/restaurants", restaurantRouter);
route.use("/review", reviewRouter);
route.use("/tag", tagRouter);
route.use("/webhook", webhookRouter);
route.use("/dish", dishRouter);

export default route;
