import axiosClient from "@/src/core/api/axios-instance";

export const deleteSupplierService = async (brandId: string, supplierId: string): Promise<{ message: string, metadata: null }> => {
  return await axiosClient.delete(`/brand-owner/${brandId}/supplier/${supplierId}`);
};

