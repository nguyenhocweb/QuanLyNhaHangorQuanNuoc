import { prisma } from "../../../../databases/init.mongodb.js";

export const updateAiModelRepo = async (id, data) => {
  return await prisma.aiModel.update({
    where: { id },
    data
  });
};