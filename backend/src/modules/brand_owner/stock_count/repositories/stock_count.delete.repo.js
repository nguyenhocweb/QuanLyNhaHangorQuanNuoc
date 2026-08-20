import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteStockCountRepo = async (id) => {
  return await prisma.stockCount.delete({ where: { id } });
};
