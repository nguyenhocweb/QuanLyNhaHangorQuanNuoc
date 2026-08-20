import { Router } from "express";
import { aiAdminController } from "./controllers/ai.admin.controller.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";

const route = Router();

// Endpoint: /api/v1/system-admin/ai/chat
route.post("/chat", asyncHandler(aiAdminController.chat));

export default route;
