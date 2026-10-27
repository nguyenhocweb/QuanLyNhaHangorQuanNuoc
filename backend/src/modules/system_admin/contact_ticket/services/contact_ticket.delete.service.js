import { deleteContactTicketRepo } from "../repositories/contact_ticket.delete.repo.js";
import { getContactTicketByIdRepo } from "../repositories/contact_ticket.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const deleteContactTicketService = async (id) => {
  const existing = await getContactTicketByIdRepo(id);
  if (!existing) {
    throw new NotFoundError("Không tìm thấy phiếu hỗ trợ này");
  }

  return await deleteContactTicketRepo(id);
};
