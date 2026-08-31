import { Router } from "express";
import { getRestaurantsController } from "./controler.restaurant/getRestaurants.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import getRestaurantsValidator from "./validator.restaurant/getRestaurants.validator.js";

// Import Senior Pro Max controllers
import { getPublicRestaurantController } from "./controllers/restaurant.get.controller.js";
import { getPublicRestaurantHoursController } from "./controllers/restaurant_hours.get.controller.js";
import { getPublicRestaurantMenuController } from "./controllers/restaurant_menu.get.controller.js";
import { getPublicRestaurantReviewsController } from "./controllers/restaurant_reviews.get.controller.js";
import { getAvailableTablesController } from "./controllers/restaurant_tables.get.controller.js";
import { getPublicMenuItemsController } from "./controllers/restaurant_menu_items.get.controller.js";
import { restaurantPublicValidator } from "./validators/restaurant.public.validator.js";
import { getAvailableTablesValidator } from "./validators/restaurant_tables.get.validator.js";
import { getPublicMenuItemsValidator } from "./validators/restaurant_menu_items.get.validator.js";
import { createReservationController } from "../../customer/reservation/reservation.controller/CreateReservation.controller.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";

const route = Router();

// Lấy danh sách nhà hàng (hỗ trợ phân trang, lọc theo danh mục, vị trí, tìm kiếm)
route.get("", validate(getRestaurantsValidator), asyncHandler(getRestaurantsController));

// ===== Đặt bàn trực tiếp =====
route.post("/reservation", authenticateToken, asyncHandler(createReservationController));

// ===== V2 Endpoints =====
route.get("/v2/:id", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantController));
route.get("/v2/:id/operating-hours", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantHoursController));
route.get("/v2/:id/menu", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantMenuController));
route.get("/v2/:id/menu-items", validate(getPublicMenuItemsValidator), asyncHandler(getPublicMenuItemsController));
route.get("/v2/:id/reviews", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantReviewsController));
route.get("/v2/:id/tables/available", validate(getAvailableTablesValidator), asyncHandler(getAvailableTablesController));

// ===== Direct Endpoints (Legacy & Standard) =====
route.get("/:id", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantController));
route.get("/:id/operating-hours", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantHoursController));
route.get("/:id/menu", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantMenuController));
route.get("/:id/menu-items", validate(getPublicMenuItemsValidator), asyncHandler(getPublicMenuItemsController));
route.get("/:id/reviews", validate(restaurantPublicValidator), asyncHandler(getPublicRestaurantReviewsController));
route.get("/:id/tables/available", validate(getAvailableTablesValidator), asyncHandler(getAvailableTablesController));

export default route;