import { prisma } from "../../../../databases/init.mongodb.js";

export const findPurchaseOrderByIdRepo = async (id) => {
  return await prisma.purchaseOrder.findUnique({
    where: { id },
    include: { items: true }
  });
};

export const deletePurchaseOrderRepo = async (id) => {
  return await prisma.purchaseOrder.delete({
    where: { id }
  });
};
