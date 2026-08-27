import express from "express";
import { brandCrmController } from "./controllers/crm.controller.js";
import { authorizeRole } from "../../../../src/core/middlewares/authorizeRole.middleware.js";
// Route này được nhúng vào /brand-owner/:id_brand/crm nên đã có authenticateToken từ root

const route = express.Router({ mergeParams: true });

route.use(authorizeRole("Quản lý thương hiệu", "Admin"));

route.get("/analytics", brandCrmController.getAnalytics);
route.get("/transactions", brandCrmController.getTransactions);

export default route;
