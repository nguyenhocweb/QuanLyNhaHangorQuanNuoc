import { prisma } from "../../../../databases/init.mongodb.js";

export const revokeApiKeyRepo = async (id) => {
  return await prisma.apiKey.update({
    where: { id },
    data: { status: 'REVOKED' }
  });
};
