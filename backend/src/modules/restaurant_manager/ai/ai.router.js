import { Router } from "express";
import { aiManagerController } from "./controllers/ai.manager.controller.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const route = Router({ mergeParams: true });

// Endpoint: /api/v1/restaurant-manager/ai/chat
route.post("/chat", asyncHandler(aiManagerController.chat));

export default route;
