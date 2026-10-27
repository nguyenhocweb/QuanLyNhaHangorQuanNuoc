import { prisma } from "../../../../databases/init.mongodb.js";

export const getAdminAuthors = async () => {
  return await prisma.webAuthor.findMany({
    orderBy: [
      { isLeader: "desc" },
      { displayOrder: "asc" },
      { createdAt: "desc" }
    ]
  });
};

export const findAuthorById = async (id) => {
  return await prisma.webAuthor.findUnique({
    where: { id }
  });
};
