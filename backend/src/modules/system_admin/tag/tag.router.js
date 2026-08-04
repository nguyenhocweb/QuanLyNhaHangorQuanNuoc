import express from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { createTagValidator } from "./validators/createTag.validator.js";
import { updateTagValidator } from "./validators/updateTag.validator.js";

import { createTagController } from "./controllers/createTag.controller.js";
import { getAllTagsController, getTagController } from "./controllers/getTag.controller.js";
import { updateTagController } from "./controllers/updateTag.controller.js";
import { deleteTagController } from "./controllers/deleteTag.controller.js";

const route = express.Router();

route.post("/", validate(createTagValidator), createTagController);
route.get("/", getAllTagsController);
route.get("/:id", getTagController);
route.put("/:id", validate(updateTagValidator), updateTagController);
route.delete("/:id", deleteTagController);

export default route;
