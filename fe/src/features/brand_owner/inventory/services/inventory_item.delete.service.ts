import axiosClient from "@/src/core/api/axios-instance";

export const deleteInventoryItemService = async (brandId: string, itemId: string): Promise<{ message: string, metadata: null }> => {
  return await axiosClient.delete(`/brand-owner/${brandId}/inventory-item/${itemId}`);
};

