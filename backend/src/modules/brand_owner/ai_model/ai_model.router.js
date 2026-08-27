import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getActiveAiModelsController } from "../../system_admin/ai_model/controllers/ai_model.get.controller.js";

const route = Router({ mergeParams: true });

// Lấy danh sách AI Model đang hoạt động
route.get("/active", asyncHandler(getActiveAiModelsController));

export default route;
