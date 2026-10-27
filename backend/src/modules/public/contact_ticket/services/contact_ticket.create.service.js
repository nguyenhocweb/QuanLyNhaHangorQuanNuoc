import { createContactTicketRepo } from "../repositories/contact_ticket.create.repo.js";

export const createContactTicketService = async (payload, clientIp) => {
  // Tạo mã ticket tự động: TK-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketCode = `TK-${dateStr}-${randomNum}`;

  const ticketData = {
    ticketCode,
    guestName: payload.guestName,
    guestEmail: payload.guestEmail,
    guestPhone: payload.guestPhone || null,
    hasZalo: Boolean(payload.hasZalo),
    subject: payload.subject || "Yêu cầu hỗ trợ khách hàng",
    message: payload.message,
    status: "OPEN",
    priority: "MEDIUM",
    ipAddress: clientIp || null,
    deviceInfo: payload.deviceInfo || null
  };

  const newTicket = await createContactTicketRepo(ticketData);

  return {
    ticketCode: newTicket.ticketCode,
    guestName: newTicket.guestName,
    createdAt: newTicket.createdAt,
    status: newTicket.status
  };
};
