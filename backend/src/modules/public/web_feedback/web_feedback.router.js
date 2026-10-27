import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createWebFeedbackValidator } from "./validators/web_feedback.create.validator.js";
import * as createController from "./controllers/web_feedback.create.controller.js";
import * as getController from "./controllers/web_feedback.get.controller.js";

const route = Router();

// 1. Lấy danh sách đánh giá đã duyệt / Testimonials công khai & thống kê
route.get("/", getController.getPublicFeedbacks);

// 2. Bất kỳ ai (Guest hoặc User) gửi nhận xét góp ý
route.post("/", validate(createWebFeedbackValidator), createController.createWebFeedback);

export default route;
