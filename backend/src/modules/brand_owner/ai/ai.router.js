import { Router } from "express";
import { aiOwnerController } from "./controllers/ai.owner.controller.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";

const route = Router();

// Endpoint: /api/v1/brand-owner/ai/chat
route.post("/chat", asyncHandler(aiOwnerController.chat));

export default route;
