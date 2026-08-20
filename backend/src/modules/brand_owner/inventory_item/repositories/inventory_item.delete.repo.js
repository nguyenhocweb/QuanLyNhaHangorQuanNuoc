import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteInventoryItemRepo = async (id) => {
  return await prisma.inventoryItem.delete({
    where: { id }
  });
};

export const findInventoryItemByIdRepo = async (id) => {
  return await prisma.inventoryItem.findUnique({
    where: { id }
  });
};
