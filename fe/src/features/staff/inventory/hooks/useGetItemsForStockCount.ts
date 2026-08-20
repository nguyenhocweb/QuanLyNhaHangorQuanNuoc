import { useQuery } from "@tanstack/react-query";
import { getItemsForStockCountService } from "../services/stockCountItem.get.service";

export const useGetItemsForStockCount = (restaurantId: string, role: string) => {
  return useQuery({
    queryKey: ['items_for_stock_count', restaurantId, role],
    queryFn: async () => { 
      const data = await getItemsForStockCountService(restaurantId, role); 
      return data; 
    },
    enabled: !!restaurantId && !!role,
    staleTime: 60 * 1000,
  });
};
