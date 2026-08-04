import express from "express";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import { createItemValidator } from "./validators/item.create.validator.js";
import { updateItemValidator, deleteItemValidator } from "./validators/item.update.validator.js";
import { createItemController } from "./controllers/item.create.controller.js";
import { getItemController } from "./controllers/item.get.controller.js";
import { updateItemController } from "./controllers/item.update.controller.js";
import { deleteItemController } from "./controllers/item.delete.controller.js";

const route = express.Router();

// GET /api/v1/brand_owner/menu/items
route.get("/", getItemController);

// POST /api/v1/brand_owner/menu/items
route.post("/", validate(createItemValidator), createItemController);

// PUT /api/v1/brand_owner/menu/items/:id
route.put("/:id", validate(updateItemValidator), updateItemController);

// DELETE /api/v1/brand_owner/menu/items/:id
route.delete("/:id", validate(deleteItemValidator), deleteItemController);

export default route;
