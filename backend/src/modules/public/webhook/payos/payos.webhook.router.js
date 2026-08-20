import { Router } from "express";
import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { payosWebhookController } from "./payos.webhook.controller.js";

const route = Router();

route.post("/", asyncHandler(payosWebhookController.handleIpn));

export default route;
