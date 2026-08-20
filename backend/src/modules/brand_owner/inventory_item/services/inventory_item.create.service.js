import { createInventoryItemRepo } from "../repositories/inventory_item.create.repo.js";

export const createInventoryItemService = async (data) => {
  if (data.categoryId === "") delete data.categoryId;
  if (data.supplierId === "") delete data.supplierId;
  
  if (!data.sku || data.sku.trim() === "") {
    data.sku = `ITM-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  
  return await createInventoryItemRepo(data);
};
