import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createPaymentMethodValidator } from "./validators/payment_method.create.validator.js";
import { updatePaymentMethodValidator } from "./validators/payment_method.update.validator.js";
import { getPaymentMethods, getPaymentMethodById } from "./controllers/payment_method.get.controller.js";
import { createPaymentMethod } from "./controllers/payment_method.create.controller.js";
import { updatePaymentMethod } from "./controllers/payment_method.update.controller.js";
import { deletePaymentMethod } from "./controllers/payment_method.delete.controller.js";

const route = Router();

route.get("/", getPaymentMethods);
route.get("/:id", getPaymentMethodById);
route.post("/", validate(createPaymentMethodValidator), createPaymentMethod);
route.put("/:id", validate(updatePaymentMethodValidator), updatePaymentMethod);
route.delete("/:id", deletePaymentMethod);

export default route;
