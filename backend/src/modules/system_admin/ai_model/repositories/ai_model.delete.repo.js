import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteAiModelRepo = async (id) => {
  return await prisma.aiModel.delete({ where: { id } });
};