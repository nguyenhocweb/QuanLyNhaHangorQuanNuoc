import { Router } from "express";
import { getSystemReviews } from "./controllers/review.get.controller.js";
import { updateReviewStatus } from "./controllers/review.status.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getSystemReviewsValidator } from "./validators/review.get.validator.js";
import { updateReviewStatusValidator } from "./validators/review.status.validator.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const route = Router({ mergeParams: true });

// Get all reviews across the system
route.get("/", validate(getSystemReviewsValidator), asyncHandler(getSystemReviews));

// Update review status (approve/reject/spam)
route.patch("/:id/status", validate(updateReviewStatusValidator), asyncHandler(updateReviewStatus));

export default route;
