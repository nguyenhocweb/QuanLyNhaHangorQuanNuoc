import axiosClient from "@/src/core/api/axios-instance";

export const getStockCountsService = async (restaurantId: string, role: string, status?: string, page: number = 1, limit: number = 10) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  let url = `${basePath}/inventory/stock_counts?restaurantId=${restaurantId}&page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }
  const response = await axiosClient.get(url);
  return response.data;
};
