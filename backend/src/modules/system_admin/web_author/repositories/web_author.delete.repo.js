import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteWebAuthor = async (id) => {
  return await prisma.webAuthor.delete({
    where: { id }
  });
};
