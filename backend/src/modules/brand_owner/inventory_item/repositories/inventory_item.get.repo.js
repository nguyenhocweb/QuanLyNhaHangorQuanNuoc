import { prisma } from "../../../../databases/init.mongodb.js";

export const getInventoryItemsRepo = async (brandId, skip, take) => {
  const where = { brandId };
  const [items, totalCount] = await prisma.$transaction([
    prisma.inventoryItem.findMany({
      where,
      skip,
      take,
      include: {
        supplier: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.inventoryItem.count({ where })
  ]);
  
  return { items, totalCount };
};
