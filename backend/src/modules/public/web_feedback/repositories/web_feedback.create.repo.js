import { prisma } from "../../../../databases/init.mongodb.js";

export const createWebFeedback = async (data) => {
  return await prisma.webFeedback.create({
    data
  });
};
