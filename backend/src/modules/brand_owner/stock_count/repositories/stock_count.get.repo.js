import { prisma } from "../../../../databases/init.mongodb.js";

export const getStockCountsRepo = async (brandId, filters, skip, take) => {
  const query = { brandId, status: { not: 'DRAFT' } };
  if (filters.restaurantId) query.restaurantId = filters.restaurantId;
  
  const [stockCounts, totalCount] = await prisma.$transaction([
    prisma.stockCount.findMany({
      where: query,
      skip,
      take,
      include: { items: { include: { inventoryItem: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.stockCount.count({ where: query })
  ]);

  // Inject recent price for Brand Owner
  const inventoryItemIds = [...new Set(stockCounts.flatMap(c => c.items.map(i => i.inventoryItem?.id)).filter(Boolean))];
  const latestPoItems = await prisma.purchaseOrderItem.findMany({
    where: { inventoryItemId: { in: inventoryItemIds } },
    orderBy: { id: 'desc' },
    distinct: ['inventoryItemId']
  });
  const poPriceMap = new Map(latestPoItems.map(po => [po.inventoryItemId, po.unitPrice]));

  for (const count of stockCounts) {
    for (const item of count.items) {
      if (item.inventoryItem) {
        item.inventoryItem.minPrice = poPriceMap.has(item.inventoryItemId) ? poPriceMap.get(item.inventoryItemId) : item.inventoryItem.minPrice;
      }
    }
  }

  return { stockCounts, totalCount };
};

export const getStockCountByIdRepo = async (id) => {
  const stockCount = await prisma.stockCount.findUnique({
    where: { id },
    include: { items: { include: { inventoryItem: true } } }
  });

  if (stockCount && stockCount.items) {
    const inventoryItemIds = stockCount.items.map(i => i.inventoryItem?.id).filter(Boolean);
    const latestPoItems = await prisma.purchaseOrderItem.findMany({
      where: { inventoryItemId: { in: inventoryItemIds } },
      orderBy: { id: 'desc' },
      distinct: ['inventoryItemId']
    });
    const poPriceMap = new Map(latestPoItems.map(po => [po.inventoryItemId, po.unitPrice]));

    for (const item of stockCount.items) {
      if (item.inventoryItem) {
        item.inventoryItem.minPrice = poPriceMap.has(item.inventoryItemId) ? poPriceMap.get(item.inventoryItemId) : item.inventoryItem.minPrice;
      }
    }
  }

  return stockCount;
};
