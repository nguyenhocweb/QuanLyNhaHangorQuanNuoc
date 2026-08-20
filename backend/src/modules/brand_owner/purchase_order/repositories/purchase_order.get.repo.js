import { prisma } from "../../../../databases/init.mongodb.js";

export const getPurchaseOrdersRepo = async (brandId, filter = {}, skip, take) => {
  const restaurants = await prisma.restaurant.findMany({
    where: { brandId },
    select: { id: true }
  });
  const restaurantIds = restaurants.map(r => r.id);

  const where = {
    ...filter,
    restaurantId: { in: [...restaurantIds, brandId] }
  };

  const [purchaseOrders, totalCount] = await prisma.$transaction([
    prisma.purchaseOrder.findMany({
      where,
      skip,
      take,
      include: {
        supplier: true,
        items: {
          include: {
            inventoryItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.purchaseOrder.count({ where })
  ]);

  return { purchaseOrders, totalCount };
};
