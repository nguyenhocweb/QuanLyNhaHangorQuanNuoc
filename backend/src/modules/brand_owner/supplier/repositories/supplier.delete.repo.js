import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteSupplierRepo = async (id) => {
  return await prisma.supplier.delete({
    where: { id }
  });
};

export const findSupplierByIdRepo = async (id) => {
  return await prisma.supplier.findUnique({
    where: { id }
  });
};
