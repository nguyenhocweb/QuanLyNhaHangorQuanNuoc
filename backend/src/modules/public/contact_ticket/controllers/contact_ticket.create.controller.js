import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createContactTicketService } from "../services/contact_ticket.create.service.js";

export const createContactTicketController = asyncHandler(async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const result = await createContactTicketService(req.body, clientIp);

  return res.status(201).json({
    message: "Gửi yêu cầu hỗ trợ thành công! Đội ngũ CSKH sẽ liên hệ lại với bạn sớm nhất.",
    data: result
  });
});
