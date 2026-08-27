import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getActiveAiChatboxesController } from "../../system_admin/ai_chatbox/controllers/ai_chatbox.get.controller.js";

const route = Router({ mergeParams: true });

// Lấy danh sách AI Chatbox đang hoạt động
route.get("/active", asyncHandler(getActiveAiChatboxesController));

export default route;
