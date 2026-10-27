import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getContactTicketsService } from "../services/contact_ticket.get.service.js";

export const getContactTicketsController = asyncHandler(async (req, res) => {
  const result = await getContactTicketsService(req.query);

  return res.status(200).json({
    message: "Lấy danh sách phiếu hỗ trợ thành công",
    data: result
  });
});
