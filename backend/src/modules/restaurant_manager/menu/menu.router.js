import express from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { menuUpdateValidator } from "./validators/menu.validator.js";
import { getRestaurantMenuController } from "./controllers/menu.get.controller.js";
import { updateRestaurantMenuController } from "./controllers/menu.update.controller.js";

const route = express.Router();

route.use(authenticateToken);

route.get("/", getRestaurantMenuController);
route.patch("/:menuItemId", validate(menuUpdateValidator), updateRestaurantMenuController);

export default route;
