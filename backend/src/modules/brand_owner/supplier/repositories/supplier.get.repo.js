import { prisma } from "../../../../databases/init.mongodb.js";

export const getSuppliersRepo = async (brandId, skip, take) => {
  const where = { brandId };
  const [suppliers, totalCount] = await prisma.$transaction([
    prisma.supplier.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" }
    }),
    prisma.supplier.count({ where })
  ]);
  
  return { suppliers, totalCount };
};
