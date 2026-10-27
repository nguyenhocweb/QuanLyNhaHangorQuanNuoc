import { getContactTicketsRepo } from "../repositories/contact_ticket.get.repo.js";

export const getContactTicketsService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }

  if (query.search && query.search.trim()) {
    const s = query.search.trim();
    where.OR = [
      { ticketCode: { contains: s, mode: "insensitive" } },
      { guestName: { contains: s, mode: "insensitive" } },
      { guestEmail: { contains: s, mode: "insensitive" } },
      { guestPhone: { contains: s, mode: "insensitive" } },
      { message: { contains: s, mode: "insensitive" } }
    ];
  }

  const { tickets, total } = await getContactTicketsRepo({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  });

  return {
    tickets,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
