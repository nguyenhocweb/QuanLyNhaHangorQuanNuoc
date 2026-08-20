import { Router } from "express";
import v1Router from "../modules/router.js";
const route = Router();
route.use("/v1",v1Router);
export default route;