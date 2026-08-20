import axiosClient from "@/src/core/api/axios-instance";
import { PurchaseOrder } from "../types/purchase_order.type";

export const getPurchaseOrdersService = async (
  brandId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<{ message: string, metadata: PurchaseOrder[], options: { totalCount: number, totalPages: number, page: number, limit: number } }> => {
  return await axiosClient.get(`/brand-owner/${brandId}/purchase-order`, { params: { page, limit } });
};

