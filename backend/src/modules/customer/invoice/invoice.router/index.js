import { Router } from "express";
import { authenticateToken } from "../../../../core/middlewares/authenticateToken.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getMyInvoicesController } from "../invoice.controller/GetMyInvoices.controller.js";

const route = Router();

route.get("", authenticateToken, asyncHandler(getMyInvoicesController));

export default route;
