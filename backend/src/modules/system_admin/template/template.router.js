import express from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";

import { templateCreateValidator } from "./validators/template.create.validator.js";
import { templateUpdateValidator } from "./validators/template.update.validator.js";
import { templateDeleteValidator } from "./validators/template.delete.validator.js";

import { createTemplateController } from "./controllers/template.create.controller.js";
import { getTemplatesController } from "./controllers/template.get.controller.js";
import { updateTemplateController } from "./controllers/template.update.controller.js";
import { deleteTemplateController } from "./controllers/template.delete.controller.js";

import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";

const templateRouter = express.Router();

templateRouter.use(authenticateToken);
templateRouter.use(authorizeRole("Admin"));

templateRouter.post("/", validate(templateCreateValidator), createTemplateController);
templateRouter.get("/", getTemplatesController);
templateRouter.put("/:id", validate(templateUpdateValidator), updateTemplateController);
templateRouter.delete("/:id", validate(templateDeleteValidator), deleteTemplateController);

export default templateRouter;
