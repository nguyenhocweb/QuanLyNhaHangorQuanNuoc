import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteFeedback = async (id) => {
  return await prisma.webFeedback.delete({
    where: { id }
  });
};
