import { Router } from "express";
import { validate } from "../../core/middlewares/validator.middleware.js";
import getDishValidator from "./validator/getDish.validator.js";
import { getDishsController } from "./controller/getDishs.controller.js";
const route=Router();
route.get("",validate(getDishValidator),getDishsController);
export default route