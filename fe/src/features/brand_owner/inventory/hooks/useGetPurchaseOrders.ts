import { useQuery } from '@tanstack/react-query';
import { getPurchaseOrdersService } from '../service/purchase_order.get.service';

export const useGetPurchaseOrders = (brandId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['purchase_orders', brandId, page, limit],
    queryFn: async () => { const { data } = await getPurchaseOrdersService(brandId!, page, limit); return data; },
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
