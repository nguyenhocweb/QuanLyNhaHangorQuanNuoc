import { Router } from "express";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { getActiveAiChatboxesController } from "./controllers/ai_chatbox.get.controller.js";

const route = Router();

// Public / Brand endpoints
route.get("/active", asyncHandler(getActiveAiChatboxesController));

// Admin endpoints for Chatboxes management
route.use(authorizeRole("Admin"));

export default route;
