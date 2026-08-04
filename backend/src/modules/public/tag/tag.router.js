import express from "express";
import { getAllTagsController, getTagController } from "../../system_admin/tag/controllers/getTag.controller.js";

const route = express.Router();

route.get("/", getAllTagsController);
route.get("/:id", getTagController);

export default route;
