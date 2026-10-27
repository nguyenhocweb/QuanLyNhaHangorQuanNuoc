import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getContactTicketsValidator } from "./validators/contact_ticket.get.validator.js";
import { updateContactTicketValidator } from "./validators/contact_ticket.update.validator.js";
import { getContactTicketsController } from "./controllers/contact_ticket.get.controller.js";
import { updateContactTicketController } from "./controllers/contact_ticket.update.controller.js";
import { deleteContactTicketController } from "./controllers/contact_ticket.delete.controller.js";

const router = Router();

router.get("/", validate(getContactTicketsValidator), getContactTicketsController);
router.patch("/:id", validate(updateContactTicketValidator), updateContactTicketController);
router.delete("/:id", deleteContactTicketController);

export default router;
