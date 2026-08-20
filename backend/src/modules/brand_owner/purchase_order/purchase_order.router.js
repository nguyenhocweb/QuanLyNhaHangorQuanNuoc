import express from "express";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";

import { getPurchaseOrdersController } from "./controllers/purchase_order.get.controller.js";
import { createPurchaseOrderController } from "./controllers/purchase_order.create.controller.js";
import { updatePurchaseOrderController } from "./controllers/purchase_order.update.controller.js";
import { deletePurchaseOrderController } from "./controllers/purchase_order.delete.controller.js";

import { createPurchaseOrderValidator } from "./validators/purchase_order.create.validator.js";
import { updatePurchaseOrderValidator } from "./validators/purchase_order.update.validator.js";

const route = express.Router({ mergeParams: true });

route.use(authorizeRole("Chủ thương hiệu"));

route.get("/", asyncHandler(getPurchaseOrdersController));
route.post("/", validate(createPurchaseOrderValidator), asyncHandler(createPurchaseOrderController));
route.put("/:id", validate(updatePurchaseOrderValidator), asyncHandler(updatePurchaseOrderController));
route.delete("/:id", asyncHandler(deletePurchaseOrderController));

export default route;
