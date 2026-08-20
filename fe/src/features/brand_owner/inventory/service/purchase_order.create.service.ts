import axiosClient from "@/src/core/api/axios-instance";
import { CreatePurchaseOrderFormValues } from "../schemas/purchase_order.schema";

export const createPurchaseOrderService = async (brandId: string, data: CreatePurchaseOrderFormValues): Promise<any> => {
  return await axiosClient.post(`/brand-owner/${brandId}/purchase-order`, data);
};

