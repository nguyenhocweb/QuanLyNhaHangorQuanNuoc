import { prisma } from "../../../../databases/init.mongodb.js";

export const getInventoryStocksRepo = async (brandId, filter = {}, skip, take) => {
  const where = {};
  
  if (filter.restaurantId) {
    where.restaurantId = filter.restaurantId;
  } else {
    // Nếu không truyền restaurantId, lấy danh sách các restaurant của brand này
    const restaurants = await prisma.restaurant.findMany({
      where: { brandId },
      select: { id: true }
    });
    const restaurantIds = restaurants.map(r => r.id);
    where.restaurantId = { in: restaurantIds };
  }

  const [stocks, totalCount] = await prisma.$transaction([
    prisma.inventoryStock.findMany({
      where,
      skip,
      take,
      include: {
        inventoryItem: true
      },
      orderBy: {
        quantity: 'asc' // Sắp xếp theo số lượng từ thấp đến cao để dễ thấy cảnh báo
      }
    }),
    prisma.inventoryStock.count({ where })
  ]);

  return { stocks, totalCount };
};
