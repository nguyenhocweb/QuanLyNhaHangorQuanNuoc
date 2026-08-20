import express from "express";
import coreRouter from "./core/core.router.js";
import categoryRouter from "./category/category.router.js";
import itemRouter from "./item/item.router.js";

const route = express.Router();

// Mount sub-routers
route.use("/", coreRouter);
route.use("/categories", categoryRouter);
route.use("/items", itemRouter);

export default route;
