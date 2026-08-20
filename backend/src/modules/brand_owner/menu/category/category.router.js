import express from "express";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import { createCategoryValidator } from "./validators/category.create.validator.js";
import { updateCategoryValidator, deleteCategoryValidator } from "./validators/category.update.validator.js";
import { createCategoryController } from "./controllers/category.create.controller.js";
import { getCategoryController } from "./controllers/category.get.controller.js";
import { updateCategoryController } from "./controllers/category.update.controller.js";
import { deleteCategoryController } from "./controllers/category.delete.controller.js";

const route = express.Router();

// GET /api/v1/brand_owner/menu/categories
route.get("/", getCategoryController);

// POST /api/v1/brand_owner/menu/categories
route.post("/", validate(createCategoryValidator), createCategoryController);

// PUT /api/v1/brand_owner/menu/categories/:id
route.put("/:id", validate(updateCategoryValidator), updateCategoryController);

// DELETE /api/v1/brand_owner/menu/categories/:id
route.delete("/:id", validate(deleteCategoryValidator), deleteCategoryController);

export default route;
