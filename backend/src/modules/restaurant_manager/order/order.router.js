import express from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { orderGetController } from "./controllers/order.get.controller.js";
import { orderCreateController } from "./controllers/order.create.controller.js";
import { orderUpdateController } from "./controllers/order.update.controller.js";
import { createOrderValidator } from "./validators/order.create.validator.js";
import { updateOrderValidator } from "./validators/order.update.validator.js";

const orderRouter = express.Router({ mergeParams: true });

// Tất cả APIs đều yêu cầu đăng nhập và có quyền Quản lý nhà hàng hoặc Nhân viên
orderRouter.use(authenticateToken);
orderRouter.use(authorizeRole("Quản lý nhà hàng", "Nhân viên"));

// GET /api/v1/restaurant-manager/order
orderRouter.get("/", orderGetController.getOrders);

// GET /api/v1/restaurant-manager/order/:id
orderRouter.get("/:id", orderGetController.getOrderById);

// POST /api/v1/restaurant-manager/order
orderRouter.post("/", validate(createOrderValidator.body), orderCreateController.createOrder);

// PUT /api/v1/restaurant-manager/order/:id
orderRouter.put("/:id", validate(updateOrderValidator.body), orderUpdateController.updateOrder);

export default orderRouter;
