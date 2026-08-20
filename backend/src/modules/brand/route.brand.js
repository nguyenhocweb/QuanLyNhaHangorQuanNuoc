import {Router} from "express";
import {getBrandsController} from "./controller.brand/getBrands.controller.js";
import {validate} from "../../core/middlewares/validator.middleware.js";
import getBrandsValidator from "./validator.brand/getBrands.validator.js";
const route=Router();
route.get("",validate(getBrandsValidator),getBrandsController);
export default route;