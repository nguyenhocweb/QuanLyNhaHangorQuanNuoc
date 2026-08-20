import { Router } from "express";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { getBrandPurchaseRequests } from "./controllers/request.get.controller.js";
import { previewSplitRequests } from "./controllers/request.split.controller.js";
import { generatePurchaseOrders } from "./controllers/request.generate.controller.js";
import { rejectPurchaseRequests } from "./controllers/request.reject.controller.js";

const brandOwnerPurchaseRequestRouter = Router({ mergeParams: true });

brandOwnerPurchaseRequestRouter.use(authorizeRole("Chủ thương hiệu"));

// Lấy danh sách PR của toàn hệ thống (Brand)
brandOwnerPurchaseRequestRouter.get("/", asyncHandler(getBrandPurchaseRequests));

// Preview gộp đơn & chia theo Supplier
brandOwnerPurchaseRequestRouter.post("/preview-split", asyncHandler(previewSplitRequests));

// Xác nhận tạo hàng loạt PO
brandOwnerPurchaseRequestRouter.post("/generate-pos", asyncHandler(generatePurchaseOrders));

// Từ chối (Reject) Yêu cầu nhập kho
brandOwnerPurchaseRequestRouter.post("/reject", asyncHandler(rejectPurchaseRequests));

export default brandOwnerPurchaseRequestRouter;
