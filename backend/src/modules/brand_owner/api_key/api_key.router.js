import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getApiKeysService } from "../../system_admin/api_key/services/api_key.get.service.js";
import { createApiKeyService } from "../../system_admin/api_key/services/api_key.create.service.js";
import { revokeApiKey } from "../../system_admin/api_key/controllers/api_key.revoke.controller.js";
import { activateApiKey } from "../../system_admin/api_key/controllers/api_key.activate.controller.js";
import { updateGlobalApiKey } from "../../system_admin/api_key/controllers/api_key.update.controller.js";
import { prisma } from "../../../databases/init.mongodb.js";
import { ForbiddenError } from "../../../core/constants/error/index.js";

const route = Router({ mergeParams: true });

// Middleware bảo vệ: Đảm bảo Brand Owner chỉ thao tác trên Key của chính họ
const verifyApiKeyOwnership = async (req, res, next) => {
    const { id } = req.params;
    const { id_brand } = req.params;
    const key = await prisma.apiKey.findUnique({ where: { id } });
    if (!key || key.brandId !== id_brand) {
        return next(new ForbiddenError("Bạn không có quyền thao tác trên API Key này"));
    }
    next();
};

// 1. Lấy danh sách API Keys
route.get("/", asyncHandler(async (req, res) => {
    // Bắt buộc sao chép req.query sang object mới để tránh lỗi un-mutable của Express qs parser
    const query = { ...req.query, brandId: req.params.id_brand };
    const result = await getApiKeysService(query);
    res.status(200).json({
        message: "Lấy danh sách API Key thành công",
        metadata: result
    });
}));

// 2. Tạo API Key
route.post("/", asyncHandler(async (req, res) => {
    // Bắt buộc sao chép req.body sang object mới
    const payload = { ...req.body, brandId: req.params.id_brand, keyType: "BRAND" };
    const result = await createApiKeyService(payload);
    res.status(201).json({
        message: "Tạo API Key thành công",
        metadata: result
    });
}));

// 3. Thu hồi API Key
route.post("/:id/revoke", asyncHandler(verifyApiKeyOwnership), asyncHandler(revokeApiKey));

// 4. Kích hoạt API Key
route.post("/:id/activate", asyncHandler(verifyApiKeyOwnership), asyncHandler(activateApiKey));

// 5. Cập nhật API Key
route.put("/:id", asyncHandler(verifyApiKeyOwnership), asyncHandler(updateGlobalApiKey));

export default route;
