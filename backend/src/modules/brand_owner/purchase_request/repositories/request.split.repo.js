import { prisma } from "../../../../databases/init.mongodb.js";

export const previewSplitRequestsRepo = async (brandId, requestIds) => {
  const requests = await prisma.purchaseRequest.findMany({
    where: {
      id: { in: requestIds },
      brandId
    },
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
  });
  return requests;
};
