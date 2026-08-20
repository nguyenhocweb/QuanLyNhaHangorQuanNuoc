import axiosClient from "@/src/core/api/axios-instance";

export const submitStockCountService = async (id: string, role: string) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  const response = await axiosClient.patch(`${basePath}/inventory/stock_counts/${id}/submit`);
  return response.data;
};
