import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getUpgradeRequestsController, updateUpgradeRequestStatusController } from "./controllers/index.js";

const route = Router();

route.get("/", asyncHandler(getUpgradeRequestsController));
route.patch("/:id/status", asyncHandler(updateUpgradeRequestStatusController));

export default route;
