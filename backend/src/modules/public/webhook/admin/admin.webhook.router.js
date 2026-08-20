import express from "express";
import { handleAdminWebhook } from "./controllers/admin.webhook.controller.js";

const route = express.Router();

// Webhook cho Admin thu tiền Subscription
// VD: POST /api/v1/webhook/admin/payment/PAYOS
route.post("/payment/:gatewayCode", handleAdminWebhook);

export default route;
