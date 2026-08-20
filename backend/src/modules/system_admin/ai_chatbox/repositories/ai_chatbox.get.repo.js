import { prisma } from "../../../../databases/init.mongodb.js";

export const getActiveAiChatboxesRepo = async () => {
  return await prisma.aiChatbox.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
    orderBy: { name: 'asc' }
  });
};
