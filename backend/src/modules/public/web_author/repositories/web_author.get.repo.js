import { prisma } from "../../../../databases/init.mongodb.js";

export const getPublicAuthors = async () => {
  return await prisma.webAuthor.findMany({
    where: {
      isActive: true
    },
    orderBy: [
      { isLeader: "desc" },
      { displayOrder: "asc" },
      { createdAt: "asc" }
    ]
  });
};
