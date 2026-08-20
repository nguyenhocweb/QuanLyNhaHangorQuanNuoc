import axiosClient from "@/src/core/api/axios-instance";

export const updatePurchaseOrderService = async (brandId: string, id: string, data: any): Promise<any> => {
  return await axiosClient.put(`/brand-owner/${brandId}/purchase-order/${id}`, data);
};

