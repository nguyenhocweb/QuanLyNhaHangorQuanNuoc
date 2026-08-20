import { useQuery } from "@tanstack/react-query";
import { getInventoryItemsService } from "../services/inventory_item.get.service";

export const useGetInventoryItems = (brandId: string | undefined, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["brand-inventory-items", brandId, page, limit],
    queryFn: async () => {
      const { data } = await getInventoryItemsService(brandId!, page, limit);
      return data;
    },
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
