import { prisma } from "../../../../databases/init.mongodb.js";

export const getPurchaseRequestsRepo = async (brandId, filter, skip, limit) => {
  const [data, totalCount] = await Promise.all([
    prisma.purchaseRequest.findMany({
      where: { brandId, ...filter },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            inventoryItem: true
          }
        },
        restaurant: {
          select: { name: true }
        }
      }
    }),
    prisma.purchaseRequest.count({
      where: { brandId, ...filter }
    })
  ]);

  return { data, totalCount };
};
