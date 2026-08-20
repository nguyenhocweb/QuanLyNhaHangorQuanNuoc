import axiosClient from "@/src/core/api/axios-instance";
import { Supplier } from "../types/supplier.type";
import { SupplierFormValues } from "../schemas/supplier.schema";

export const updateSupplierService = async (brandId: string, supplierId: string, data: SupplierFormValues): Promise<{ message: string, metadata: Supplier }> => {
  return await axiosClient.put(`/brand-owner/${brandId}/supplier/${supplierId}`, data);
};

