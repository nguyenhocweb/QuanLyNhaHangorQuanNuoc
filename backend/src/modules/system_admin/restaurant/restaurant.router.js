import { Router } from "express";
import { getRestaurants, getRestaurantById } from "./controllers/restaurant.get.controller.js";
import { createRestaurant } from "./controllers/restaurant.create.controller.js";
import { updateRestaurant } from "./controllers/restaurant.update.controller.js";

const route = Router();

route.get("/", getRestaurants);
route.get("/:id", getRestaurantById);
route.post("/", createRestaurant);
route.put("/:id", updateRestaurant);

export default route;
