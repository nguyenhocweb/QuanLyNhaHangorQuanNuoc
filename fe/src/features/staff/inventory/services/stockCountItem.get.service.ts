import axiosClient from "@/src/core/api/axios-instance";

export const getItemsForStockCountService = async (restaurantId: string, role: string): Promise<any> => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  const url = `${basePath}/inventory/stock_counts/items?restaurantId=${restaurantId}`;
  const response = await axiosClient.get(url);
  return response.data;
};
