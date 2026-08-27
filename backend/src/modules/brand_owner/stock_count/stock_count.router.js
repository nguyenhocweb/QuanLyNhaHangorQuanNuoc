import express from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { createStockCountValidator } from "./validators/stock_count.create.validator.js";
import { updateStockCountValidator } from "./validators/stock_count.update.validator.js";

import { approveStockCountValidator } from "./validators/stock_count.approve.validator.js";

import { createStockCountController } from "./controllers/stock_count.create.controller.js";
import { getStockCountsController } from "./controllers/stock_count.get.controller.js";
import { updateStockCountController } from "./controllers/stock_count.update.controller.js";
import { deleteStockCountController } from "./controllers/stock_count.delete.controller.js";
import { approveStockCount } from "./controllers/stock_count.approve.controller.js";
import { rejectStockCount } from "./controllers/stock_count.reject.controller.js";

const route = express.Router({ mergeParams: true });
route.use(authorizeRole("Quản lý thương hiệu", "Admin", "Quản lý nhà hàng"));

route.post("/", validate(createStockCountValidator), asyncHandler(createStockCountController.create));
route.get("/", asyncHandler(getStockCountsController.getAll));
route.get("/:id", asyncHandler(getStockCountsController.getById));
route.put("/:id", validate(updateStockCountValidator), asyncHandler(updateStockCountController.update));
route.delete("/:id", asyncHandler(deleteStockCountController.deleteStockCount));

route.patch("/:id/approve", authorizeRole("Quản lý thương hiệu", "Admin"), validate(approveStockCountValidator), asyncHandler(approveStockCount));
route.patch("/:id/reject", authorizeRole("Quản lý thương hiệu", "Admin"), validate(approveStockCountValidator), asyncHandler(rejectStockCount));

export default route;
