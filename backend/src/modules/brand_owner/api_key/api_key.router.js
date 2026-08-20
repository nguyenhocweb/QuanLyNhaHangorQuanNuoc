import { Router } from "express";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { getBrandApiKeys } from "./controllers/api_key.get.controller.js";
import { createBrandApiKey } from "./controllers/api_key.create.controller.js";
import { revokeBrandApiKey } from "./controllers/api_key.revoke.controller.js";
import { activateBrandApiKey } from "./controllers/api_key.activate.controller.js";
import { updateBrandApiKey } from "./controllers/api_key.update.controller.js";

const brandApiKeyRouter = Router({ mergeParams: true });

brandApiKeyRouter.use(authorizeRole("Chủ thương hiệu"));

// Lấy danh sách API Keys của Brand
brandApiKeyRouter.get("/", asyncHandler(getBrandApiKeys));

// Tạo mới API Key cho Brand
brandApiKeyRouter.post("/", asyncHandler(createBrandApiKey));

// Thu hồi API Key
brandApiKeyRouter.post("/:id/revoke", asyncHandler(revokeBrandApiKey));

// Kích hoạt lại API Key
brandApiKeyRouter.post("/:id/activate", asyncHandler(activateBrandApiKey));

// Cập nhật API Key
brandApiKeyRouter.put("/:id", asyncHandler(updateBrandApiKey));

export default brandApiKeyRouter;
