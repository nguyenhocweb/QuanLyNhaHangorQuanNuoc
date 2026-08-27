import express from "express";
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { authorizeRole } from "../../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import { approveStockCountValidator } from "../../../brand_owner/stock_count/validators/stock_count.approve.validator.js";
import { managerApproveStockCountService } from "./services/approve.service.js";
import { managerRejectStockCountService } from "./services/reject.service.js";
import { stockCountController } from "../../../staff/inventory/stock_counts/controllers/stock_counts.controller.js";
import { stockCountValidator } from "../../../staff/inventory/stock_counts/validators/stock_counts.validator.js";
import { managerGetStockCountsController } from "./controllers/stock_counts.get.controller.js";
import { stockCountUpdateController } from "../../../staff/inventory/stock_counts/controllers/stock_counts.update.controller.js";
import { stockCountDeleteController } from "../../../staff/inventory/stock_counts/controllers/stock_counts.delete.controller.js";

const route = express.Router({ mergeParams: true });
route.use(authorizeRole("Quản lý nhà hàng"));

route.patch("/:id/approve", validate(approveStockCountValidator), asyncHandler(async (req, res) => {
  const stockCountId = req.params.id;
  const userId = req.user.id;
  const { reason } = req.body;

  const result = await managerApproveStockCountService.approve(stockCountId, userId, reason);

  res.status(200).json({
    message: "Phê duyệt phiếu kiểm kê thành công",
    metadata: result,
  });
}));

route.patch("/:id/reject", validate(approveStockCountValidator), asyncHandler(async (req, res) => {
  const stockCountId = req.params.id;
  const userId = req.user.id;
  const { reason } = req.body;

  const result = await managerRejectStockCountService.reject(stockCountId, userId, reason);

  res.status(200).json({
    message: "Từ chối phiếu kiểm kê thành công",
    metadata: result,
  });
}));

// Cho phép Quản lý tự đếm kho (giống Nhân viên)
route.get("/items", asyncHandler(stockCountController.getItemsForCount));
route.post("/", validate(stockCountValidator.create), asyncHandler(stockCountController.createDraft));
route.put("/:id", validate(stockCountValidator.create), asyncHandler(stockCountUpdateController.updateDraft));
route.delete("/:id", asyncHandler(stockCountDeleteController.deleteStockCount));
route.patch("/:id/submit", validate(stockCountValidator.submit), asyncHandler(stockCountController.submitPending));
route.get("/", asyncHandler(managerGetStockCountsController.getCounts));

export default route;
