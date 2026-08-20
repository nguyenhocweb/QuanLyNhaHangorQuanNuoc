import axiosClient from "@/src/core/api/axios-instance";

export const deleteStockCountService = async (id: string, role: string) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  const response = await axiosClient.delete(`${basePath}/inventory/stock_counts/${id}`);
  return response.data;
};
