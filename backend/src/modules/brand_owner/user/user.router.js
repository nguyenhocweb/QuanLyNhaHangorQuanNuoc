import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { searchUsersController } from "./controllers/user.search.controller.js";

const route = Router({ mergeParams: true });

route.get("/search", asyncHandler(searchUsersController));

export default route;
