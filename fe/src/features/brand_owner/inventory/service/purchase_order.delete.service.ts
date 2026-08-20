import axiosClient from "@/src/core/api/axios-instance";

export const deletePurchaseOrderService = async (brandId: string, id: string): Promise<any> => {
  return await axiosClient.delete(`/brand-owner/${brandId}/purchase-order/${id}`);
};

