import axiosClient from "@/src/core/api/axios-instance";
import { InventoryItem } from "../types/inventory_item.type";

export const getInventoryItemsService = async (
  brandId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<{ message: string, metadata: InventoryItem[], options: { totalCount: number, totalPages: number, page: number, limit: number } }> => {
  return await axiosClient.get(`/brand-owner/${brandId}/inventory-item`, { params: { page, limit } });
};

