import { prisma } from "../../../../../databases/init.mongodb.js";

export const createPurchaseRequestRepo = async ({ restaurantId, items, notes, expectedDate }) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { brandId: true }
  });
  
  if (!restaurant) throw new Error("Restaurant not found");
  const brandId = restaurant.brandId;

  const count = await prisma.purchaseRequest.count({
    where: { brandId }
  });
  
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  const requestCode = `PR-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
  
  return await prisma.purchaseRequest.create({
    data: {
      brandId,
      restaurantId,
      requestCode,
      notes,
      expectedDate: expectedDate ? new Date(expectedDate) : null,
      status: "PENDING",
      items: {
        create: items.map(item => ({
          inventoryItemId: item.inventoryItemId,
          requestedQty: item.requestedQty
        }))
      }
    },
    include: {
      items: true
    }
  });
};
