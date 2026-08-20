import { prisma } from "../../../../databases/init.mongodb.js";

export const updateSupplierRepo = async (id, data) => {
  return await prisma.supplier.update({
    where: { id },
    data
  });
};
