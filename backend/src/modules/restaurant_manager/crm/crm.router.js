import express from "express";
import { crmController } from "./controllers/crm.controller.js";
import { authorizeRole } from "../../../../src/core/middlewares/authorizeRole.middleware.js";

const route = express.Router();

route.use(authorizeRole("Quản lý nhà hàng", "Admin", "Chủ thương hiệu"));

route.get("/analytics", crmController.getAnalytics);

export default route;
