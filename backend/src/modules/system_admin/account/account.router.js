import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";

// Import Controllers
import { getAccountsController } from "./controllers/account.get.controller.js";
import { createAccountController } from "./controllers/account.create.controller.js";
import { updateAccountController } from "./controllers/account.update.controller.js";
import { deleteAccountController } from "./controllers/account.delete.controller.js";

// Import Validators
import { getAccountsValidator } from "./validators/account.get.validator.js";
import { createAccountValidator } from "./validators/account.create.validator.js";
import { updateAccountValidator } from "./validators/account.update.validator.js";
import { deleteAccountValidator } from "./validators/account.delete.validator.js";

const accountRouter = Router();

accountRouter.get(
  "/",
  validate(getAccountsValidator),
  getAccountsController
);

accountRouter.post(
  "/",
  validate(createAccountValidator),
  createAccountController
);

accountRouter.put(
  "/:id",
  validate(updateAccountValidator),
  updateAccountController
);

accountRouter.delete(
  "/:id",
  validate(deleteAccountValidator),
  deleteAccountController
);

export default accountRouter;
