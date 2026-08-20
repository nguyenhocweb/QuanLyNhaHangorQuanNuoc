import express from "express";
import { getMenuController } from "./controllers/menu.get.controller.js";
import { createMenuController } from "./controllers/menu.create.controller.js";
import { updateMenuController } from "./controllers/menu.update.controller.js";
import { deleteMenuController } from "./controllers/menu.delete.controller.js";
import { createMenuValidator, updateMenuValidator, deleteMenuValidator } from "./validators/menu.validator.js";
import { validate } from "../../../../core/middlewares/validator.middleware.js";

const route = express.Router();

route.get("/", getMenuController);
route.post("/", validate(createMenuValidator), createMenuController);
route.put("/:id", validate(updateMenuValidator), updateMenuController);
route.delete("/:id", validate(deleteMenuValidator), deleteMenuController);

export default route;
