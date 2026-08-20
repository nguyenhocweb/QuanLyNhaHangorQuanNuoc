import { Router } from "express";
import { getReport } from "./controllers/report.get.controller.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";

const route = Router({ mergeParams: true });

route.use(authenticateToken);
route.get("/", asyncHandler(getReport));

export default route;
