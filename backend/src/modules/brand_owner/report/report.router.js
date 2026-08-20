import { Router } from "express";
import { getReport } from "./controllers/report.get.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getReportValidator } from "./validators/report.get.validator.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";

const route = Router({ mergeParams: true });

route.use(authenticateToken);

route.get("/", validate(getReportValidator), asyncHandler(getReport));

export default route;
