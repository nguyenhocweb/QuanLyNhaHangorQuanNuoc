import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";

// Controllers
import * as getController from "./controllers/subscription.get.controller.js";
import * as createController from "./controllers/subscription.create.controller.js";
import * as updateController from "./controllers/subscription.update.controller.js";
import * as deleteController from "./controllers/subscription.delete.controller.js";
import * as revenueController from "./controllers/subscription.revenue.controller.js";
import * as getTransactionController from "./controllers/subscription.transaction.get.controller.js";

// Validators
import { createSubscriptionValidator } from "./validators/subscription.create.validator.js";
import { updateSubscriptionValidator } from "./validators/subscription.update.validator.js";

const route = Router();

route.get("/features", getController.getFeatures);
route.get("/revenue", revenueController.getRevenue);
route.get("/", getController.getSubscriptions);
route.get("/transactions/:subscriptionId", getTransactionController.getTransaction);
route.post("/", validate(createSubscriptionValidator), createController.createSubscription);
route.put("/:id", validate(updateSubscriptionValidator), updateController.updateSubscription);
route.delete("/:id", deleteController.deleteSubscription);

export default route;
