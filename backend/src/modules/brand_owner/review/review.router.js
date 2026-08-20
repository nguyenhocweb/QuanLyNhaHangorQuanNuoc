import { Router } from "express";
import { getBrandReviews } from "./controllers/review.get.controller.js";
import { replyReview } from "./controllers/review.reply.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getBrandReviewsValidator } from "./validators/review.get.validator.js";
import { replyReviewValidator } from "./validators/review.reply.validator.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const route = Router({ mergeParams: true });

// Get all reviews for a brand (with filters)
route.get("/", validate(getBrandReviewsValidator), asyncHandler(getBrandReviews));

// Reply to a review
route.put("/:id/reply", validate(replyReviewValidator), asyncHandler(replyReview));

export default route;
