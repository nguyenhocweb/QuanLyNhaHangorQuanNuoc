import { prisma } from "../../../../databases/init.mongodb.js";

export const updateFeedback = async (id, data) => {
  return await prisma.webFeedback.update({
    where: { id },
    data
  });
};
