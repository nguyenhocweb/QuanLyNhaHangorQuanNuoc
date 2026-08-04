import { Router } from "express";
import { paymentWebhookController } from "./webhook.controller.js";

const route = Router();

// Endpoint webhook chung cho tất cả các payment gateways
route.post("/payment/:gatewayCode", paymentWebhookController);

export default route;
