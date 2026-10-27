import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateContactTicketService } from "../services/contact_ticket.update.service.js";

export const updateContactTicketController = asyncHandler(async (req, res) => {
  const result = await updateContactTicketService(req.params.id, req.body);

  return res.status(200).json({
    message: "Cập nhật phiếu hỗ trợ thành công",
    data: result
  });
});
