import { Router } from "express";
import { getDashboardStats } from "./controllers/dashboard.get.controller.js";
import { getDashboardBrands } from "./controllers/dashboardBrands.get.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/", getDashboardStats);
dashboardRouter.get("/brands", getDashboardBrands);

export default dashboardRouter;
