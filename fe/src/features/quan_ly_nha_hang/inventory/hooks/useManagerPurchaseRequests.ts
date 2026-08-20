import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/src/core/api/axios-instance';
import { toast } from 'sonner';

export const useGetPurchaseRequests = (restaurantId: string | undefined, role: string, page = 1, limit = 10, status = '') => {
  return useQuery({
    queryKey: ['manager_purchase_requests', restaurantId, role, page, limit, status],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/restaurant-manager/inventory/requests`, {
        params: { restaurantId, page, limit, status }
      });
      return data;
    },
    enabled: !!restaurantId && (role === "Quản lý nhà hàng" || role === "Quản lý thương hiệu"),
    staleTime: 60 * 1000,
  });
};
