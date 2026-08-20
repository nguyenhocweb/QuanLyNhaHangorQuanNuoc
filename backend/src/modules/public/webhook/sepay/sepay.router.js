import express from "express";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import { sepayWebhookValidator } from "./validators/sepay.webhook.validator.js";
import { handleSepayWebhook } from "./controllers/sepay.webhook.controller.js";

const route = express.Router();

// Endpoint Public cho SePay gọi vào
// VD: POST /api/v1/webhook/sepay?token=XYZ
route.post(
    "/",
    validate(sepayWebhookValidator),
    handleSepayWebhook
);

export default route;
