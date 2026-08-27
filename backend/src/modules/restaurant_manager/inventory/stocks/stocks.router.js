import { Router } from "express";
import { authorizeRole } from "../../../../core/middlewares/authorizeRole.middleware.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { managerStocksController } from "./controllers/stocks.controller.js";

const managerStocksRouter = Router({ mergeParams: true });

// Lấy danh mục hàng hóa tổng của brand
managerStocksRouter.get("/master-items", authorizeRole("Quản lý nhà hàng", "Nhân viên"), asyncHandler(managerStocksController.getMasterItems));

// Lấy danh sách tồn kho của nhà hàng
managerStocksRouter.get("/", authorizeRole("Quản lý nhà hàng", "Nhân viên"), asyncHandler(managerStocksController.getStocks));

// Thêm mặt hàng mới vào danh sách theo dõi tồn kho của nhà hàng
managerStocksRouter.post("/", authorizeRole("Quản lý nhà hàng", "Nhân viên"), asyncHandler(managerStocksController.addStockItem));

export default managerStocksRouter;
