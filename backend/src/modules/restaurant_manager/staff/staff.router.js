import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getStaffsController } from "./controllers/staff.get.controller.js";
import { createStaffController } from "./controllers/staff.create.controller.js";
import { updateStaffController } from "./controllers/staff.update.controller.js";
import { deleteStaffController } from "./controllers/staff.delete.controller.js";
import { createStaffValidator } from "./validators/staff.create.validator.js";
import { updateStaffValidator } from "./validators/staff.update.validator.js";
import { asyncHandler } from "../../../core/utils/asyncHandler.js";

const route = Router();

route.use(authenticateToken);
route.use(authorizeRole("Quản lý nhà hàng", "Nhân viên", "Admin", "Chủ thương hiệu"));

route.get("/", asyncHandler(getStaffsController));
route.post("/", validate(createStaffValidator), asyncHandler(createStaffController));
route.put("/:id", validate(updateStaffValidator), asyncHandler(updateStaffController));
route.delete("/:id", asyncHandler(deleteStaffController));

export default route;
