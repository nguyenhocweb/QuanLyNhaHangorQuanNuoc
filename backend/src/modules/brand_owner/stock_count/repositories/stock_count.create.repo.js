import { prisma } from "../../../../databases/init.mongodb.js";

export const createStockCountRepo = async (data) => {
  return await prisma.stockCount.create({
    data: {
      restaurantId: data.restaurantId,
      brandId: data.brandId,
      createdBy: data.createdBy,
      code: data.code,
      notes: data.notes,
      items: {
        create: data.items.map(item => ({
          inventoryItemId: item.inventoryItemId,
          systemQty: item.systemQty,
          actualQty: item.systemQty, // Default to systemQty initially
          discrepancy: 0
        }))
      }
    },
    include: {
      items: true
    }
  });
};
