import axiosClient from "@/src/core/api/axios-instance";
import { Supplier } from "../types/supplier.type";
import { SupplierFormValues } from "../schemas/supplier.schema";

export const createSupplierService = async (brandId: string, data: SupplierFormValues): Promise<{ message: string, metadata: Supplier }> => {
  return await axiosClient.post(`/brand-owner/${brandId}/supplier`, data);
};

