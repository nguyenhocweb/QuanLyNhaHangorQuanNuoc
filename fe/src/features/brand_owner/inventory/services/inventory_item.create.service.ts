import axiosClient from "@/src/core/api/axios-instance";
import { InventoryItem } from "../types/inventory_item.type";
import { InventoryItemFormValues } from "../schemas/inventory_item.schema";

export const createInventoryItemService = async (brandId: string, data: InventoryItemFormValues): Promise<{ message: string, metadata: InventoryItem }> => {
  return await axiosClient.post(`/brand-owner/${brandId}/inventory-item`, data);
};

