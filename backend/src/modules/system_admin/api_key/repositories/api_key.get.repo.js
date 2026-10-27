import { prisma } from "../../../../databases/init.mongodb.js";

export const getApiKeysRepo = async (query) => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;

  let where = {};

  if (query.brandId) {
    where.brandId = query.brandId;
  } else {
    where.brandId = null; // Only show Global Keys if no brandId is specified
  }

  if (query.chatboxId) {
    where.chatboxId = query.chatboxId;
  }

  if (query.keyType) {
    where.keyType = query.keyType;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { contactEmail: { contains: search, mode: "insensitive" } },
      { prefix: { contains: search, mode: "insensitive" } },
    ];
  }
  
  if (status) {
    where.status = status;
  }

  const [keys, total] = await Promise.all([
    prisma.apiKey.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        prefix: true,
        name: true,
        contactEmail: true,
        brandId: true,
        status: true,
        keyType: true,
        chatboxId: true,
        restrictedModelId: true,
        chatbox: { select: { id: true, name: true } },
        restrictedModel: { select: { id: true, name: true, displayName: true } },
        lastUsedAt: true,
        lastIp: true,
        createdAt: true
      }
    }),
    prisma.apiKey.count({ where })
  ]);

  return { keys, total, totalPages: Math.ceil(total / limit) };
};
