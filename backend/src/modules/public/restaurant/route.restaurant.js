import { Router } from "express";
import { getRestaurantsController } from "./controler.restaurant/getRestaurants.controller.js";
import getRestaurantController from "./controler.restaurant/getRestaurant.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import getRestaurantValidator from "./validator.restaurant/getRestaurant.validator.js";
import getRestaurantsValidator from "./validator.restaurant/getRestaurants.validator.js";

// Import new controllers
import { getPublicRestaurantController } from "./controllers/restaurant.get.controller.js";
import { getPublicRestaurantHoursController } from "./controllers/restaurant_hours.get.controller.js";
import { getPublicRestaurantMenuController } from "./controllers/restaurant_menu.get.controller.js";
import { getPublicRestaurantReviewsController } from "./controllers/restaurant_reviews.get.controller.js";
import { getAvailableTablesController } from "./controllers/restaurant_tables.get.controller.js";
import { getPublicMenuItemsController } from "./controllers/restaurant_menu_items.get.controller.js";
import { restaurantPublicValidator } from "./validators/restaurant.public.validator.js";
import { getAvailableTablesValidator } from "./validators/restaurant_tables.get.validator.js";
import { getPublicMenuItemsValidator } from "./validators/restaurant_menu_items.get.validator.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const route = Router();

// Existing endpoints
route.get("", validate(getRestaurantsValidator), getRestaurantsController);
route.get("/:id", validate(getRestaurantValidator), getRestaurantController); // Legacy

// New Senior Pro Max Endpoints
route.get("/v2/:id", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantController));
route.get("/v2/:id/operating-hours", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantHoursController));
route.get("/v2/:id/menu", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantMenuController));
route.get("/v2/:id/menu-items", validate(getPublicMenuItemsValidator), asyncHandler(getPublicMenuItemsController));
route.get("/v2/:id/reviews", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantReviewsController));
route.get("/v2/:id/tables/available", validate(getAvailableTablesValidator), asyncHandler(getAvailableTablesController));

export default route;