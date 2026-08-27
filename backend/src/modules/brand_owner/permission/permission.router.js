import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getPermissionsController } from "./controllers/permission.get.controller.js";

const route = Router({ mergeParams: true });

// Lấy danh sách phân quyền (RESTAURANT và BRAND)
route.get("/", asyncHandler(getPermissionsController));

export default route;
