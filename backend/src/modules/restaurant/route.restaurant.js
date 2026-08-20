import {Router} from "express";
import { getRestaurantsController } from "./controler.restaurant/getRestaurants.controller.js";
import {validate} from "../../core/middlewares/validator.middleware.js";
import getRestaurantValidator from "./validator.restaurant/getRestaurant.validator.js";
const route=Router();
route.get("",validate(getRestaurantValidator),getRestaurantsController);
export default route;