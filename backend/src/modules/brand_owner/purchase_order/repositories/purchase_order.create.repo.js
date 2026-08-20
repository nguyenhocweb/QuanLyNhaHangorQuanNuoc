import { prisma } from "../../../../databases/init.mongodb.js";

export const createPurchaseOrderRepo = async (data) => {
  return await prisma.purchaseOrder.create({
    data: {
      restaurantId: data.restaurantId,
      supplierId: data.supplierId,
      createdBy: data.createdBy,
      poNumber: data.poNumber,
      totalAmount: data.totalAmount,
      invoiceImageUrl: data.invoiceImageUrl || null,
      items: {
        create: data.items.map(item => ({
          inventoryItemId: item.inventoryItemId,
          orderQty: item.orderQty,
          unitPrice: item.unitPrice,
          actualAmount: item.orderQty * item.unitPrice
        }))
      }
    },
    include: {
      items: true
    }
  });
};
