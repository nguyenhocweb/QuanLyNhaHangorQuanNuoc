import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";

import { getBrandsController } from "./controller.brand/getBrands.controller.js";
import { getBrandByIdController } from "./controller.brand/getBrandById.controller.js";
import { createBrandImagesController } from "./controller.brand/CreateBrandImages.controller.js";
import { createBrandBasicByAdminController } from "./controller.brand/CreateBrandBasicByAdmin.controller.js";
import { updateBrandBasicByAdminController } from "./controller.brand/UpdateBrandBasicByAdmin.controller.js";
import { deleteBrandByAdminController } from "./controller.brand/DeleteBrandByAdmin.controller.js";

import { validate } from "../../../core/middlewares/validator.middleware.js";
import getBrandsValidator from "./validator.brand/getBrands.validator.js";
import getBrandByIdValidator from "./validator.brand/getBrandById.validator.js";
import { createBrandBasicByAdminValidator, createBrandImageLinksValidator } from "./validator.brand/CreateBrandByAdmin.valodator.js";
import { updateBrandBasicByAdminValidator } from "./validator.brand/UpdateBrandByAdmin.validator.js";

const route = Router();
route.post("", authenticateToken, validate(createBrandBasicByAdminValidator), createBrandBasicByAdminController);
route.get("", validate(getBrandsValidator), getBrandsController);
route.get("/:_id", validate(getBrandByIdValidator), getBrandByIdController);
route.patch("/:_id/images", authenticateToken, validate(createBrandImageLinksValidator), createBrandImagesController);
route.put("/:_id", authenticateToken, validate(updateBrandBasicByAdminValidator), updateBrandBasicByAdminController);
route.delete("/:_id", authenticateToken, validate(getBrandByIdValidator), deleteBrandByAdminController);

export default route;