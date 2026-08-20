import { prisma } from "../../../../databases/init.mongodb.js";

export const activateApiKeyRepo = async (id) => {
  return await prisma.apiKey.update({
    where: { id },
    data: { status: 'ACTIVE' }
  });
};
