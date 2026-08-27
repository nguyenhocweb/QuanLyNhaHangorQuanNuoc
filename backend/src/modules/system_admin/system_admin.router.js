import { Router } from "express";

// Import all sub-routers
import accountRouter from "./account/account.router.js";
import adminPaymentConfigRouter from "./admin_payment_config/admin_payment_config.router.js";
import aiRouter from "./ai/ai.router.js";
import aiChatboxRouter from "./ai_chatbox/ai_chatbox.router.js";
import aiModelRouter from "./ai_model/ai_model.router.js";
import amenityRouter from "./amenity/amenity.router.js";
import apiKeyRouter from "./api_key/api_key.router.js";
import categoryRouter from "./category/category.router.js";
import dashboardRouter from "./dashboard/dashboard.router.js";
import paymentMethodRouter from "./payment_method/payment_method.router.js";
import restaurantRouter from "./restaurant/restaurant.router.js";
import reviewRouter from "./review/review.router.js";
import subscriptionRouter from "./subscription/subscription.router.js";
import tagRouter from "./tag/tag.router.js";
import templateRouter from "./template/template.router.js";
import upgradeRequestRouter from "./upgrade_request/upgradeRequest.router.js";
import brandRouter from "./brand/route.brand.js";
import notificationRouter from "../notifications/notification.router.js";

const route = Router();

route.use("/account", accountRouter);
route.use("/payment-configs", adminPaymentConfigRouter);
route.use("/ai", aiRouter);
route.use("/ai-chatboxes", aiChatboxRouter);
route.use("/ai-models", aiModelRouter);
route.use("/amenity", amenityRouter);
route.use("/api-keys", apiKeyRouter);
route.use("/category", categoryRouter);
route.use("/dashboard", dashboardRouter);
route.use("/payment-method", paymentMethodRouter);
route.use("/restaurant", restaurantRouter);
route.use("/review", reviewRouter);
route.use("/subscription", subscriptionRouter);
route.use("/tag", tagRouter);
route.use("/template", templateRouter);
route.use("/upgrade-request", upgradeRequestRouter);
route.use("/brand", brandRouter);
route.use("/notifications", notificationRouter);

export default route;
