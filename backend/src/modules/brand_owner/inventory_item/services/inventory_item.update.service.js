import { updateInventoryItemRepo } from "../repositories/inventory_item.update.repo.js";
import { findInventoryItemByIdRepo } from "../repositories/inventory_item.delete.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateInventoryItemService = async (id, data, brandId) => {
  const item = await findInventoryItemByIdRepo(id);
  if (!item || item.brandId !== brandId) {
    throw new NotFoundError("Không tìm thấy hàng hóa");
  }
  if (data.categoryId === "") data.categoryId = null;
  if (data.supplierId === "") data.supplierId = null;
  
  return await updateInventoryItemRepo(id, data);
};
