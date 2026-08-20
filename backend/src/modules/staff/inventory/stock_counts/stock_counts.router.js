import express from "express";
import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { authorizeRole } from "../../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import { stockCountController } from "./controllers/stock_counts.controller.js";
import { stockCountValidator } from "./validators/stock_counts.validator.js";
import { stockCountUpdateController } from "./controllers/stock_counts.update.controller.js";
import { stockCountDeleteController } from "./controllers/stock_counts.delete.controller.js";

const route = express.Router({ mergeParams: true });
route.use(authorizeRole("Nhân viên"));

route.get("/items", asyncHandler(stockCountController.getItemsForCount));
route.post("/", validate(stockCountValidator.create), asyncHandler(stockCountController.createDraft));
route.put("/:id", validate(stockCountValidator.create), asyncHandler(stockCountUpdateController.updateDraft));
route.delete("/:id", asyncHandler(stockCountDeleteController.deleteStockCount));
route.patch("/:id/submit", validate(stockCountValidator.submit), asyncHandler(stockCountController.submitPending));
// Chú ý: Nhân viên GET phiếu chỉ trả về thông tin đếm, KHÔNG trả về systemQty
route.get("/", asyncHandler(stockCountController.getMyCounts));

export default route;
