import express from "express";
import { getPublicCategoriesController } from "./controllers/category.get.controller.js";

const route = express.Router();

route.get("/", getPublicCategoriesController);

export default route;
