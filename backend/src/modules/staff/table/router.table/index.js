import {Router} from "express";
import { getTablesByIdRestaurantController } from "../table.controller/getTablesByIdRestaurant.controller.js";

const route = Router({ mergeParams: true });
route.get("",getTablesByIdRestaurantController)

export default route
