import { prisma } from "../../../../databases/init.mongodb.js";

export const createApiKeyRepo = async (data) => {
  return await prisma.apiKey.create({ data });
};
