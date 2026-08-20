import { prisma } from "../../../../databases/init.mongodb.js";

export const createAiModelRepo = async (data) => {
  return await prisma.aiModel.create({ data });
};