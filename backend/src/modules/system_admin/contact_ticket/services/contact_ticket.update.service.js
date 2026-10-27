import { getContactTicketByIdRepo } from "../repositories/contact_ticket.get.repo.js";
import { updateContactTicketRepo } from "../repositories/contact_ticket.update.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateContactTicketService = async (id, data) => {
  const existing = await getContactTicketByIdRepo(id);
  if (!existing) {
    throw new NotFoundError("Không tìm thấy phiếu hỗ trợ này");
  }

  const updateData = { ...data };
  if (data.status === "RESOLVED" && existing.status !== "RESOLVED") {
    updateData.resolvedAt = new Date();
  }

  return await updateContactTicketRepo(id, updateData);
};
