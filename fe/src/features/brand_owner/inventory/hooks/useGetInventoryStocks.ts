import axiosClient from "@/src/core/api/axios-instance";
import { useQuery } from "@tanstack/react-query";

export const getInventoryStocksService = async (brandId: string, restaurantId?: string, page: number = 1, limit: number = 10): Promise<any> => {
  const url = restaurantId 
    ? `/brand-owner/${brandId}/inventory-item/stocks?restaurantId=${restaurantId}&page=${page}&limit=${limit}`
    : `/brand-owner/${brandId}/inventory-item/stocks?page=${page}&limit=${limit}`;
  return await axiosClient.get(url);
};

export const useGetInventoryStocks = (brandId?: string, restaurantId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['inventory_stocks', brandId, restaurantId, page, limit],
    queryFn: async () => { const { data } = await getInventoryStocksService(brandId!, restaurantId, page, limit); return data; },
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};

