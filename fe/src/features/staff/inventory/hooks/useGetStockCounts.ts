import { useQuery } from "@tanstack/react-query";
import { getStockCountsService } from "../services/stockCount.get.service";

export const useGetStockCounts = (restaurantId: string, role: string, status?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['stock_counts', restaurantId, role, status, page, limit],
    queryFn: () => getStockCountsService(restaurantId, role, status, page, limit),
    enabled: !!restaurantId && !!role,
    staleTime: 60 * 1000
  });
};
