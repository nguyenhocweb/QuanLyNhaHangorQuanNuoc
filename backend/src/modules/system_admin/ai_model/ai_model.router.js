import { Router } from "express";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";

import { aiModelCreateValidator } from "./validators/ai_model.create.validator.js";
import { aiModelUpdateValidator } from "./validators/ai_model.update.validator.js";

import { createAiModelController } from "./controllers/ai_model.create.controller.js";
import { getAiModelsController, getActiveAiModelsController } from "./controllers/ai_model.get.controller.js";
import { updateAiModelController } from "./controllers/ai_model.update.controller.js";
import { deleteAiModelController } from "./controllers/ai_model.delete.controller.js";

const route = Router();

// Public / Brand endpoints
route.get("/active", asyncHandler(getActiveAiModelsController));

// Admin endpoints
route.use(authorizeRole("Admin"));
route.post("/", validate(aiModelCreateValidator), asyncHandler(createAiModelController));
route.get("/", asyncHandler(getAiModelsController));
route.put("/:id", validate(aiModelUpdateValidator), asyncHandler(updateAiModelController));
route.delete("/:id", asyncHandler(deleteAiModelController));

export default route;