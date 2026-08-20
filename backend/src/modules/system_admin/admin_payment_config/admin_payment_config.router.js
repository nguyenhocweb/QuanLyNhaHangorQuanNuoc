import express from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getAdminPaymentConfigController } from "./controllers/config.get.controller.js";
import { upsertAdminPaymentConfigController } from "./controllers/config.upsert.controller.js";
import { verifyAdminPaymentConfigController } from "./controllers/config.verify.controller.js";
import { upsertConfigValidator } from "./validators/config.validator.js";

const route = express.Router();

// GET config by systemPaymentMethodId
route.get("/:systemPaymentMethodId", getAdminPaymentConfigController);

// POST/UPSERT config by systemPaymentMethodId
route.post(
    "/:systemPaymentMethodId",
    validate(upsertConfigValidator),
    upsertAdminPaymentConfigController
);

// POST Verify config with 1,000 VND test
route.post("/:systemPaymentMethodId/verify-test", verifyAdminPaymentConfigController);

export default route;
