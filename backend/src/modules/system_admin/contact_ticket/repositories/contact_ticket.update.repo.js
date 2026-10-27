import { prisma } from "../../../../databases/init.mongodb.js";

export const updateContactTicketRepo = async (id, data) => {
  return await prisma.contactTicket.update({
    where: { id },
    data
  });
};
