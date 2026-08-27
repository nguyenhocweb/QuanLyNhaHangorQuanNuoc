import { Router } from "express";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getApiKeys } from "./controllers/api_key.get.controller.js";
import { createApiKey } from "./controllers/api_key.create.controller.js";
import { revokeApiKey } from "./controllers/api_key.revoke.controller.js";
import { activateApiKey } from "./controllers/api_key.activate.controller.js";
import { updateGlobalApiKey } from "./controllers/api_key.update.controller.js";

const systemApiKeyRouter = Router();

// Middleware
systemApiKeyRouter.use(authorizeRole("Admin"));

// Lấy danh sách API Keys
systemApiKeyRouter.get("/", asyncHandler(getApiKeys));

// Tạo API Key mới
systemApiKeyRouter.post("/", asyncHandler(createApiKey));

// Thu hồi API Key
systemApiKeyRouter.post("/:id/revoke", asyncHandler(revokeApiKey));

// Kích hoạt lại API Key
systemApiKeyRouter.post("/:id/activate", asyncHandler(activateApiKey));

// Cập nhật API Key
systemApiKeyRouter.put("/:id", asyncHandler(updateGlobalApiKey));

export default systemApiKeyRouter;
