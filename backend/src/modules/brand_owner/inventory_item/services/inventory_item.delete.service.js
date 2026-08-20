import { deleteInventoryItemRepo, findInventoryItemByIdRepo } from "../repositories/inventory_item.delete.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const deleteInventoryItemService = async (id, brandId) => {
  const item = await findInventoryItemByIdRepo(id);
  if (!item || item.brandId !== brandId) {
    throw new NotFoundError("Không tìm thấy hàng hóa");
  }
  return await deleteInventoryItemRepo(id);
};
