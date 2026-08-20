import { Router } from "express";
import adminWebhookRouter from "./admin/admin.webhook.router.js";
import sepayWebhookRouter from "./sepay/sepay.router.js";
import payosWebhookRouter from "./payos/payos.webhook.router.js";

const route = Router();

// /api/v1/webhook/admin/...
route.use("/admin", adminWebhookRouter);

// /api/v1/webhook/sepay/...
route.use("/sepay", sepayWebhookRouter);

// /api/v1/webhook/payos/...
route.use("/payos", payosWebhookRouter);

export default route;
