import { Router } from "express";
import { getRestaurants, getRestaurantById } from "./controllers/restaurant.get.controller.js";
import { createRestaurant } from "./controllers/restaurant.create.controller.js";
import { updateRestaurant } from "./controllers/restaurant.update.controller.js";
import { deleteRestaurant } from "./controllers/restaurant.delete.controller.js";

const route = Router();

route.get("/", getRestaurants);
route.get("/:id", getRestaurantById);
route.post("/", createRestaurant);
route.put("/:id", updateRestaurant);
route.delete("/:id", deleteRestaurant);

export default route;
