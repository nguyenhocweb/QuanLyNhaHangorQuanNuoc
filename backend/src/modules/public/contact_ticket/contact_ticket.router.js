import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createContactTicketValidator } from "./validators/contact_ticket.create.validator.js";
import { createContactTicketController } from "./controllers/contact_ticket.create.controller.js";

const router = Router();

router.post("/", validate(createContactTicketValidator), createContactTicketController);

export default router;
