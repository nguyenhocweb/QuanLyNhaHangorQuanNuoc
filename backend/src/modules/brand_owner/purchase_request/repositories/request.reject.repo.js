import { prisma } from "../../../../databases/init.mongodb.js";

export const rejectPurchaseRequestsRepo = async (brandId, requestIds) => {
  return await prisma.purchaseRequest.updateMany({
    where: {
      id: { in: requestIds },
      brandId,
      status: "PENDING"
    },
    data: {
      status: "REJECTED"
    }
  });
};
