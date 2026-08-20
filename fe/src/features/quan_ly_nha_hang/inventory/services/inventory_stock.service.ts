import axiosClient from "@/src/core/api/axios-instance";

export const getManagerStocksService = async (restaurantId: string, role: string, search?: string, page: number = 1, limit: number = 10) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  let url = `${basePath}/inventory/stocks?restaurantId=${restaurantId}&page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }
  return axiosClient.get(url);
};

export const addManagerStockService = async (data: { restaurantId: string, inventoryItemId: string, role: string }) => {
  const basePath = data.role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  return axiosClient.post(`${basePath}/inventory/stocks`, {
    restaurantId: data.restaurantId,
    inventoryItemId: data.inventoryItemId
  });
};

export const getManagerMasterItemsService = async (restaurantId: string, role: string) => {
  const basePath = role === "Nhân viên" ? "/staff" : "/restaurant-manager";
  return axiosClient.get(`${basePath}/inventory/stocks/master-items?restaurantId=${restaurantId}`);
};
