import { Router } from "express";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getInventoryItemsController } from "./controllers/inventory_item.get.controller.js";
import { createInventoryItemController } from "./controllers/inventory_item.create.controller.js";
import { updateInventoryItemController } from "./controllers/inventory_item.update.controller.js";
import { deleteInventoryItemController } from "./controllers/inventory_item.delete.controller.js";
import { getInventoryStocksController } from "./controllers/inventory_stock.get.controller.js";
import { createInventoryItemValidator } from "./validators/inventory_item.create.validator.js";
import { updateInventoryItemValidator } from "./validators/inventory_item.update.validator.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const inventoryItemRouter = Router({ mergeParams: true });

// Lấy danh sách tồn kho
inventoryItemRouter.get("/stocks", authorizeRole("Quản lý thương hiệu"), asyncHandler(getInventoryStocksController));

// Lấy danh sách hàng hóa
inventoryItemRouter.get("/", authorizeRole("Quản lý thương hiệu"), getInventoryItemsController);

// Thêm mới
inventoryItemRouter.post("/", authorizeRole("Quản lý thương hiệu"), validate(createInventoryItemValidator), createInventoryItemController);

// Cập nhật
inventoryItemRouter.put("/:itemId", authorizeRole("Quản lý thương hiệu"), validate(updateInventoryItemValidator), updateInventoryItemController);

// Xóa
inventoryItemRouter.delete("/:itemId", authorizeRole("Quản lý thương hiệu"), deleteInventoryItemController);

export default inventoryItemRouter;
