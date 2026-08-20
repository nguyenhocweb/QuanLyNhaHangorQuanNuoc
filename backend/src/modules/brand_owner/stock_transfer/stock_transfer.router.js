import express from "express";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { createStockTransferController } from "./controllers/stock_transfer.create.controller.js";
import { getStockTransfersController, getStockTransferByIdController } from "./controllers/stock_transfer.get.controller.js";
import { updateStockTransferController } from "./controllers/stock_transfer.update.controller.js";
import { deleteStockTransferController } from "./controllers/stock_transfer.delete.controller.js";

import { stockTransferCreateValidator } from "./validators/stock_transfer.create.validator.js";
import { stockTransferUpdateValidator } from "./validators/stock_transfer.update.validator.js";

const stockTransferRouter = express.Router({ mergeParams: true });

// Lấy danh sách phiếu chuyển kho
stockTransferRouter.get("/", authorizeRole("Chủ thương hiệu", "Admin", "Quản lý nhà hàng"), getStockTransfersController);

// Lấy chi tiết phiếu chuyển kho
stockTransferRouter.get("/:id", authorizeRole("Chủ thương hiệu", "Admin", "Quản lý nhà hàng"), getStockTransferByIdController);

// Tạo mới phiếu chuyển kho
stockTransferRouter.post("/", authorizeRole("Chủ thương hiệu", "Admin"), validate(stockTransferCreateValidator), createStockTransferController);

// Cập nhật trạng thái phiếu chuyển kho
stockTransferRouter.put("/:id", authorizeRole("Chủ thương hiệu", "Admin", "Quản lý nhà hàng"), validate(stockTransferUpdateValidator), updateStockTransferController);

// Xóa phiếu chuyển kho (chỉ áp dụng cho phiếu DRAFT)
stockTransferRouter.delete("/:id", authorizeRole("Chủ thương hiệu", "Admin"), deleteStockTransferController);

export default stockTransferRouter;
