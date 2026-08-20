import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { getEmploymentsController } from "./controllers/employment.get.controller.js";
import { createEmploymentController } from "./controllers/employment.create.controller.js";
import { updateEmploymentController } from "./controllers/employment.update.controller.js";
import { deleteEmploymentController } from "./controllers/employment.delete.controller.js";
import { createEmploymentValidator } from "./validators/employment.create.validator.js";
import { updateEmploymentValidator } from "./validators/employment.update.validator.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

const brandOwnerEmploymentRouter = Router({ mergeParams: true });

brandOwnerEmploymentRouter.get("/", asyncHandler(getEmploymentsController));

brandOwnerEmploymentRouter.post(
  "/",
  validate(createEmploymentValidator),
  asyncHandler(createEmploymentController)
);

brandOwnerEmploymentRouter.put(
  "/:id",
  validate(updateEmploymentValidator),
  asyncHandler(updateEmploymentController)
);

brandOwnerEmploymentRouter.delete(
  "/:id",
  asyncHandler(deleteEmploymentController)
);

export default brandOwnerEmploymentRouter;
