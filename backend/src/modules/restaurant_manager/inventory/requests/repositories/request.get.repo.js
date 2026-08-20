import { prisma } from "../../../../../databases/init.mongodb.js";

export const getPurchaseRequestsRepo = async ({ restaurantId, page = 1, limit = 10, status }) => {
  const skip = (page - 1) * limit;
  const where = { restaurantId };
  if (status) where.status = status;

  const [requests, totalCount] = await prisma.$transaction([
    prisma.purchaseRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            inventoryItem: {
              select: {
                id: true,
                sku: true,
                name: true,
                baseUnit: true,
              }
            }
          }
        }
      }
    }),
    prisma.purchaseRequest.count({ where })
  ]);

  return {
    requests,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }
  };
};
