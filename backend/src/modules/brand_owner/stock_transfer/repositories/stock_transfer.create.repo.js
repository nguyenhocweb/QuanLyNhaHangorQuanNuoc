import { prisma } from "../../../../databases/init.mongodb.js";

export const createStockTransferRepo = async (data) => {
  return await prisma.stockTransfer.create({
    data: {
      fromRestaurantId: data.fromRestaurantId,
      toRestaurantId: data.toRestaurantId,
      transferNumber: data.transferNumber,
      createdBy: data.createdBy,
      status: "DRAFT",
      notes: data.notes,
      items: {
        create: data.items.map(item => ({
          inventoryItemId: item.inventoryItemId,
          transferQty: item.transferQty,
          receivedQty: 0
        }))
      }
    }
  });
};
