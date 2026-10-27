import { prisma } from "../../../../databases/init.mongodb.js";

export const createContactTicketRepo = async (data) => {
  return await prisma.contactTicket.create({
    data
  });
};
