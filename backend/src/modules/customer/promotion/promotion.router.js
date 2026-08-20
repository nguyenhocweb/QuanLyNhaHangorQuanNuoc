import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getMyVoucherWalletController } from "./controllers/promotion.get-wallet.controller.js";
import { getDiscoverPromotionsController } from "./controllers/promotion.get-discover.controller.js";
import { saveVoucherController } from "./controllers/promotion.save.controller.js";
import { saveVoucherValidator } from "./validators/promotion.save.validator.js";

const route = Router();

route.get("/wallet", getMyVoucherWalletController);
route.get("/discover", getDiscoverPromotionsController);
route.post("/save", validate(saveVoucherValidator), saveVoucherController);

export default route;
