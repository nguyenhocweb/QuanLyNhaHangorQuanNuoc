import { Router } from "express";
import { ChatBoxAi } from "./ai.controller/index.js";
const route = Router();
route.post("/chat",ChatBoxAi)
export default route;