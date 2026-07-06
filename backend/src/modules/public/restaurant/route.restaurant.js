import { Router } from "express";
import { getRestaurantsController } from "./controler.restaurant/getRestaurants.controller.js";
import getRestaurantController from "./controler.restaurant/getRestaurant.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import getRestaurantValidator from "./validator.restaurant/getRestaurant.validator.js";
import getRestaurantsValidator from "./validator.restaurant/getRestaurants.validator.js";
const route = Router();
route.get("", validate(getRestaurantsValidator), getRestaurantsController);
route.get("/:id", validate(getRestaurantValidator), getRestaurantController);

export default route;