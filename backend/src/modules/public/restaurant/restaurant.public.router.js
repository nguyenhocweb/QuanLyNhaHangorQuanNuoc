import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { restaurantPublicValidator } from "./validators/restaurant.public.validator.js";
import { getPublicRestaurantController } from "./controllers/restaurant.get.controller.js";
import { getPublicRestaurantMenuController } from "./controllers/restaurant_menu.get.controller.js";
import { getPublicRestaurantReviewsController } from "./controllers/restaurant_reviews.get.controller.js";
import { getPublicRestaurantHoursController } from "./controllers/restaurant_hours.get.controller.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const route = Router();

// Lấy thông tin cơ bản
route.get("/:id", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantController));

// Lấy giờ hoạt động
route.get("/:id/operating-hours", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantHoursController));

// Lấy menu
route.get("/:id/menu", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantMenuController));

// Lấy đánh giá
route.get("/:id/reviews", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantReviewsController));

export default route;
