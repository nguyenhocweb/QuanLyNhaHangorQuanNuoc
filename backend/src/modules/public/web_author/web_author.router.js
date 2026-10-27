import { Router } from "express";
import * as getController from "./controllers/web_author.get.controller.js";

const route = Router();

// Lấy danh sách đội ngũ phát triển web (Public)
route.get("/", getController.getPublicAuthors);

export default route;
