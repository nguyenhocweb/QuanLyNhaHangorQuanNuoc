import { Router } from "express";
import { getPublicBrandsController } from "./controllers/brand.get.controller.js";
import { getPublicBrandByIdController } from "./controllers/brand.getById.controller.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import getPublicBrandsValidator from "./validators/brand.get.validator.js";
import getPublicBrandByIdValidator from "./validators/brand.getById.validator.js";

const route = Router();

// Route cho vãng lai (Public) xem danh sách thương hiệu và chi tiết thương hiệu
route.get("/", validate(getPublicBrandsValidator), getPublicBrandsController);
route.get("/:_id", validate(getPublicBrandByIdValidator), getPublicBrandByIdController);

export default route;
