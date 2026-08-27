import express from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import reviewValidator from "./validators/review.validator.js";
import reviewGetController from "./controllers/review.get.controller.js";
import reviewReplyController from "./controllers/review.reply.controller.js";
import reviewStatusController from "./controllers/review.status.controller.js";

const route = express.Router({ mergeParams: true });

route.use(authenticateToken);
route.use(authorizeRole("Quản lý nhà hàng", "Admin", "Quản lý thương hiệu"));

route.get("/", asyncHandler(reviewGetController.getReviews));
route.patch("/:id/reply", validate(reviewValidator.replyValidator), asyncHandler(reviewReplyController.replyReview));
route.patch("/:id/status", validate(reviewValidator.statusValidator), asyncHandler(reviewStatusController.updateStatus));

export default route;