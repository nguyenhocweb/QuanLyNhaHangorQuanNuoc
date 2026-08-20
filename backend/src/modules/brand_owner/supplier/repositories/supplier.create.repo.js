import { prisma } from "../../../../databases/init.mongodb.js";

export const createSupplierRepo = async (data) => {
  return await prisma.supplier.create({ data });
};
