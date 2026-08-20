import axiosClient from "@/src/core/api/axios-instance";
import { CreateStockCountFormValues } from "@/src/features/brand_owner/inventory/schemas/stock_count.schema";

export const createStockCountService = async (data: CreateStockCountFormValues, role: string) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  const response = await axiosClient.post(`${basePath}/inventory/stock_counts`, data);
  return response.data;
};
