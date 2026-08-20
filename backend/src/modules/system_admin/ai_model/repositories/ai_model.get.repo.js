import { prisma } from "../../../../databases/init.mongodb.js";

export const getAiModelsRepo = async ({ page = 1, limit = 50, search = '' }) => {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;
  
  const where = search ? { 
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } }
    ]
  } : {};

  const [data, total] = await Promise.all([
    prisma.aiModel.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.aiModel.count({ where })
  ]);
  
  return { data, meta: { total, page: Number(page), limit: take } };
};

export const getActiveAiModelsRepo = async (chatboxId) => {
  const where = chatboxId ? { chatboxId } : {};
  return await prisma.aiModel.findMany({
    where,
    orderBy: { name: 'asc' }
  });
};