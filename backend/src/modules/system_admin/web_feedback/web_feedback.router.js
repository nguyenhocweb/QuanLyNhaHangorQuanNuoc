import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { updateWebFeedbackValidator } from "./validators/web_feedback.update.validator.js";
import * as getController from "./controllers/web_feedback.get.controller.js";
import * as updateController from "./controllers/web_feedback.update.controller.js";
import * as deleteController from "./controllers/web_feedback.delete.controller.js";

const route = Router();

// 1. Lấy danh sách feedback (Quản trị, lọc theo status, rating, search)
route.get("/", getController.getAdminFeedbacks);

// 2. Duyệt / Từ chối / Báo spam / Ghim / Trả lời feedback
route.patch("/:id", validate(updateWebFeedbackValidator), updateController.updateFeedback);

// 3. Xóa feedback
route.delete("/:id", deleteController.deleteFeedback);

export default route;
