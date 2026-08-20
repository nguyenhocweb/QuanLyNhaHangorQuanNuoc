import { prisma } from "../../../../databases/init.mongodb.js";

export const updateStockTransferRepo = async (id, data, transactionOperations = []) => {
  // We can pass Prisma transaction operations from the service layer to ensure Atomicity
  if (transactionOperations.length > 0) {
    return await prisma.$transaction([
      ...transactionOperations,
      prisma.stockTransfer.update({
        where: { id },
        data
      })
    ]);
  }

  // If no additional operations, just update
  return await prisma.stockTransfer.update({
    where: { id },
    data
  });
};
