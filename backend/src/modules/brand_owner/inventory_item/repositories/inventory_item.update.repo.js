import { prisma } from "../../../../databases/init.mongodb.js";

export const updateInventoryItemRepo = async (id, data) => {
  return await prisma.inventoryItem.update({
    where: { id },
    data
  });
};
