import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteContactTicketService } from "../services/contact_ticket.delete.service.js";

export const deleteContactTicketController = asyncHandler(async (req, res) => {
  await deleteContactTicketService(req.params.id);

  return res.status(200).json({
    message: "Xóa phiếu hỗ trợ thành công"
  });
});
