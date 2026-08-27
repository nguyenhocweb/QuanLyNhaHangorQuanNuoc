import express from "express";
import { invoiceController } from "./controllers/invoice.controller.js";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";

const route = express.Router({ mergeParams: true });

// Tất cả API của brand_owner đều cần Authentication và quyền Quản lý thương hiệu
route.use(authenticateToken);
route.use(authorizeRole('Quản lý thương hiệu'));

route.get("/", asyncHandler(invoiceController.getInvoices));

export default route;
