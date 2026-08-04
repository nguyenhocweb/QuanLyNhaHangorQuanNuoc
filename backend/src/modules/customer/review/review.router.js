import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createReview } from "./controllers/review.create.controller.js";
import { createReviewValidator } from "./validators/review.create.validator.js";
import { getReviewsByRestaurant } from "./controllers/review.get-by-restaurant.controller.js";
import { getReviewsValidator } from "./validators/review.get-by-restaurant.validator.js";
import { getMyReviews } from "./controllers/review.get-my-reviews.controller.js";
import { getMyReviewsValidator } from "./validators/review.get-my-reviews.validator.js";
import { getUnreviewedMeals } from "./controllers/review.get-unreviewed.controller.js";
import { getUnreviewedMealsValidator } from "./validators/review.get-unreviewed.validator.js";
import { updateReview } from "./controllers/review.update.controller.js";
import { updateReviewValidator } from "./validators/review.update.validator.js";
import { deleteReview } from "./controllers/review.delete.controller.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";

const route = Router();

// Create review (requires auth)
route.post("/", authenticateToken, validate(createReviewValidator), asyncHandler(createReview));

// Get my reviews list & stats (requires auth)
route.get("/my-reviews", authenticateToken, validate(getMyReviewsValidator), asyncHandler(getMyReviews));

// Get unreviewed completed dining reservations (requires auth)
route.get("/unreviewed", authenticateToken, validate(getUnreviewedMealsValidator), asyncHandler(getUnreviewedMeals));

// Update review (requires auth)
route.put("/:id", authenticateToken, validate(updateReviewValidator), asyncHandler(updateReview));

// Delete review (requires auth)
route.delete("/:id", authenticateToken, validate(updateReviewValidator), asyncHandler(deleteReview));

// Get reviews by restaurant (public)
route.get("/restaurant/:restaurantId", validate(getReviewsValidator), asyncHandler(getReviewsByRestaurant));

export default route;
