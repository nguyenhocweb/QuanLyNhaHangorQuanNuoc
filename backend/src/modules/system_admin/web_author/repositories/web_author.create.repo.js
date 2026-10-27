import { prisma } from "../../../../databases/init.mongodb.js";

export const createWebAuthor = async (data) => {
  return await prisma.webAuthor.create({
    data
  });
};
