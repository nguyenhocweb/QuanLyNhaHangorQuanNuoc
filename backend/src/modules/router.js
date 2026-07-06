import { Router } from "express";

// Public Modules
import authRouter from "./public/auth/auth.router.js";
import restaurantRouter from "./public/restaurant/route.restaurant.js";
import dishRouter from "./public/menu/route.dish.js";
import aiRouter from "./public/ai/ai.router.js";

// Customer Modules
import userRouter from "./customer/profile/user.router.js";
import reservationRouter from "./customer/reservation/reservation.router/index.js";

// Staff Modules
import tableRouter from "./staff/table/router.table/index.js";

// System Admin Modules
import brandRouter from "./system_admin/brand/route.brand.js";
import dashboardRouter from "./system_admin/dashboard/dashboard.router.js";
import accountRouter from "./system_admin/account/account.router.js";
import categoryRouter from "./system_admin/category/category.router.js";
import systemRestaurantRouter from "./system_admin/restaurant/restaurant.router.js";
import subscriptionRouter from "./system_admin/subscription/subscription.router.js";
import paymentMethodRouter from "./system_admin/payment_method/payment_method.router.js";


// Shared Modules
import cloudinaryRouter from "./shared/cloudinary/router.cloudinary/index.js";

import { authenticateToken } from "../core/middlewares/authenticateToken.js";

import { authorizeRole } from "../core/middlewares/authorizeRole.middleware.js";

const route = Router();

//----------------------------------- ROUTER CỦA QUẢN TRỊ VIÊN ---------------------------------------------
const routeAdmin = Router();
// Các route khác của Admin
routeAdmin.use("/brand", brandRouter);
// routeAdmin.use("/dashboard", dashboardRouter);
routeAdmin.use("/account", accountRouter);
routeAdmin.use("/category", categoryRouter);
routeAdmin.use("/restaurant", systemRestaurantRouter);


// Public Routes
route.use("/auth", authRouter);
route.use("/ai", aiRouter);
route.use("/restaurant", restaurantRouter);
route.use("/dish", dishRouter); 
route.use("/brand", brandRouter);

// Customer Routes
route.use("/users", authenticateToken, userRouter);
route.use("/restaurant/reservation", reservationRouter);

// Staff Routes
route.use("/restaurant/:idRestaurant/table", tableRouter);

// System Admin Routes
route.use("/system-admin/brand", authenticateToken, authorizeRole('Admin'), brandRouter);
route.use("/system-admin/dashboard", authenticateToken, authorizeRole('Admin'), dashboardRouter);
route.use("/system-admin/account", authenticateToken, authorizeRole('Admin'), accountRouter);
route.use("/system-admin/category", authenticateToken, authorizeRole('Admin'), categoryRouter);
route.use("/system-admin/restaurant", authenticateToken, authorizeRole('Admin'), systemRestaurantRouter);
route.use("/system-admin/subscription", authenticateToken, authorizeRole('Admin'), subscriptionRouter);
route.use("/system-admin/payment-method", authenticateToken, authorizeRole('Admin'), paymentMethodRouter);

// Shared Routes
route.use("/cloudinary", authenticateToken, cloudinaryRouter);

export default route;