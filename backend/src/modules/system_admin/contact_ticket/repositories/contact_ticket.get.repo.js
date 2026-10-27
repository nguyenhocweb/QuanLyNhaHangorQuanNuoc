import { prisma } from "../../../../databases/init.mongodb.js";

export const getContactTicketsRepo = async ({ where, skip, take, orderBy }) => {
  const [tickets, total] = await Promise.all([
    prisma.contactTicket.findMany({
      where,
      skip,
      take,
      orderBy
    }),
    prisma.contactTicket.count({ where })
  ]);

  return { tickets, total };
};

export const getContactTicketByIdRepo = async (id) => {
  return await prisma.contactTicket.findUnique({
    where: { id }
  });
};
