import { prisma } from "../../../../databases/init.mongodb.js";

export const updateWebAuthor = async (id, data) => {
  return await prisma.webAuthor.update({
    where: { id },
    data
  });
};
