import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteContactTicketRepo = async (id) => {
  return await prisma.contactTicket.delete({
    where: { id }
  });
};
