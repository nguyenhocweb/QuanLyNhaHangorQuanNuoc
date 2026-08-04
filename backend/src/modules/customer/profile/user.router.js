

import { Router } from "express";
import { updateImageProfileController } from "./controller/updateImageProfile_controller.js";
import { UpdateInformationProfileController } from "./controller/updateInformationProfile_controller.js";
import { ChangePasswordController } from "./controller/changePassword_controller.js";
import { upgradeRequestController } from "./controller/upgradeRequest_controller.js";
import { imageProfile, upgradeRequest } from "./user.validator/index.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { upload } from "../../../core/middlewares/upload.middleware.js";

const route = Router();

route.patch("/avatar", validate(imageProfile), updateImageProfileController);
route.patch("/profile", UpdateInformationProfileController)
route.patch("/changePassword", ChangePasswordController)
route.post("/upgrade-request", validate(upgradeRequest), upgradeRequestController)

export default route;