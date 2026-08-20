import { prisma } from "../../../../databases/init.mongodb.js";

export const getStockTransfersRepo = async (brandId, filter = {}, skip, take) => {
  // Find all restaurants belonging to this brand
  const restaurants = await prisma.restaurant.findMany({
    where: { brandId },
    select: { id: true }
  });
  const restaurantIds = restaurants.map(r => r.id);

  const where = {
    ...filter,
    OR: [
      { fromRestaurantId: { in: restaurantIds } },
      { toRestaurantId: { in: restaurantIds } }
    ]
  };

  const [stockTransfers, totalCount] = await prisma.$transaction([
    prisma.stockTransfer.findMany({
      where,
      skip,
      take,
      include: {
        items: {
          include: {
            inventoryItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.stockTransfer.count({ where })
  ]);

  return { stockTransfers, totalCount };
};

export const getStockTransferByIdRepo = async (id) => {
  return await prisma.stockTransfer.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          inventoryItem: true
        }
      }
    }
  });
};
