export type TicketStatus = "OPEN" | "PROCESSING" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ICreateContactTicketPayload {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  hasZalo?: boolean;
  subject?: string;
  message: string;
  deviceInfo?: string;
}

export interface ICreateContactTicketResponse {
  ticketCode: string;
  guestName: string;
  createdAt: string;
  status: TicketStatus;
}
