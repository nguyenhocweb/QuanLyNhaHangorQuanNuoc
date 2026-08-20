import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteStockTransferRepo = async (id) => {
  return await prisma.stockTransfer.delete({
    where: { id }
  });
};
