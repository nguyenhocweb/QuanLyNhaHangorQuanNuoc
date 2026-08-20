import { updateSupplierRepo } from "../repositories/supplier.update.repo.js";
import { findSupplierByIdRepo } from "../repositories/supplier.delete.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateSupplierService = async (id, data, brandId) => {
  const supplier = await findSupplierByIdRepo(id);
  if (!supplier || supplier.brandId !== brandId) {
    throw new NotFoundError("Không tìm thấy nhà cung cấp");
  }
  if (data.contact) {
    data.contact = JSON.stringify(data.contact);
  }
  return await updateSupplierRepo(id, data);
};
