import { Router } from "express";
import { getCategoriesRestaurantController } from "./controllers/getCategory.controller.js";
import { createCategoryRestaurantController } from "./controllers/createCategory.controller.js";
import { updateCategoryRestaurantController } from "./controllers/updateCategory.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createCategoryValidator } from "./validators/createCategory.validator.js";
import { updateCategoryValidator } from "./validators/updateCategory.validator.js";

import { deleteCategoryRestaurantController } from "./controllers/deleteCategory.controller.js";

const route = Router();
route.get("/", getCategoriesRestaurantController);
route.post("/", validate(createCategoryValidator), createCategoryRestaurantController);
route.put("/:id", validate(updateCategoryValidator), updateCategoryRestaurantController);
route.delete("/:id", deleteCategoryRestaurantController);

export default route;
