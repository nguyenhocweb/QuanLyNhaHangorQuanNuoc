import { createSupplierRepo } from "../repositories/supplier.create.repo.js";

export const createSupplierService = async (data) => {
  if (data.contact) {
    data.contact = JSON.stringify(data.contact);
  }
  return await createSupplierRepo(data);
};
