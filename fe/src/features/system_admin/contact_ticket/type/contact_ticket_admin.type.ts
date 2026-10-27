export type TicketStatus = "OPEN" | "PROCESSING" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface IAdminContactTicket {
  id: string;
  ticketCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  hasZalo: boolean;
  subject?: string | null;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  adminNote?: string | null;
  adminReply?: string | null;
  assignedTo?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IGetContactTicketsQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface IContactTicketsResponse {
  tickets: IAdminContactTicket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
