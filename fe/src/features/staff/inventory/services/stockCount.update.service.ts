import axiosClient from "@/src/core/api/axios-instance";
import { CreateStockCountFormValues } from "../schema/stockCount.create.schema";

export const updateStockCountService = async (id: string, role: string, data: CreateStockCountFormValues) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  const response = await axiosClient.put(`${basePath}/inventory/stock_counts/${id}`, data);
  return response.data;
};
