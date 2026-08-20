import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getRestaurantsController } from "./controllers/getRestaurants.controller.js";
import { getRestaurantByIdController } from "./controllers/getRestaurantById.controller.js";
import { getRestaurantUtilitiesController } from "./controllers/getRestaurantUtilities.controller.js";
import { createRestaurantController } from "./controllers/createRestaurant.controller.js";
import { updateRestaurantController } from "./controllers/updateRestaurant.controller.js";
import { updateRestaurantAmenitiesController } from "./controllers/updateRestaurantAmenities.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createRestaurantValidator } from "./validators/createRestaurant.validator.js";
import { updateRestaurantValidator } from "./validators/updateRestaurant.validator.js";
import { updateRestaurantAmenitiesValidator } from "./validators/updateRestaurantAmenities.validator.js";
import { updateRestaurantTagsController } from "./controllers/updateRestaurantTags.controller.js";
import { updateRestaurantTagsValidator } from "./validators/updateRestaurantTags.validator.js";
import { updateRestaurantMenuController } from "./controllers/updateRestaurantMenu.controller.js";
import { updateRestaurantMenuValidator } from "./validators/updateRestaurantMenu.validator.js";
import { deleteRestaurantMenuController } from "./controllers/deleteRestaurantMenu.controller.js";
import { updateRestaurantTemplateController } from "./controllers/updateRestaurantTemplate.controller.js";
import { updateRestaurantTemplateValidator } from "./validators/updateRestaurantTemplate.validator.js";

const route = Router({ mergeParams: true });

// Middleware áp dụng cho tất cả route bên dưới
route.use(authenticateToken);
// "Chủ thương hiệu" role is required
route.use(authorizeRole("Chủ thương hiệu", "Chủ thương hiệu"));

route.get("/", asyncHandler(getRestaurantsController));
route.put("/template", validate(updateRestaurantTemplateValidator), updateRestaurantTemplateController);
route.get("/:id", asyncHandler(getRestaurantByIdController));
route.get("/:id/utilities", asyncHandler(getRestaurantUtilitiesController));
route.post("/", validate(createRestaurantValidator), asyncHandler(createRestaurantController));
route.put("/:id", validate(updateRestaurantValidator), asyncHandler(updateRestaurantController));
route.put("/:id/amenities", validate(updateRestaurantAmenitiesValidator), asyncHandler(updateRestaurantAmenitiesController));
route.put("/:id/tags", validate(updateRestaurantTagsValidator), asyncHandler(updateRestaurantTagsController));
route.put("/:id/menu/:menuItemId", validate(updateRestaurantMenuValidator), asyncHandler(updateRestaurantMenuController));
route.delete("/:id/menu/:menuItemId", deleteRestaurantMenuController);

export default route;
