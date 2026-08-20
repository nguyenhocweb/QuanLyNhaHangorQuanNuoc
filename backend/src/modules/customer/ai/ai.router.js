import { Router } from "express";
import { aiCustomerController } from "./controllers/ai.customer.controller.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";

const route = Router();

// Endpoint: /api/v1/customer/ai/chat
route.post("/chat", asyncHandler(aiCustomerController.chat));

export default route;
