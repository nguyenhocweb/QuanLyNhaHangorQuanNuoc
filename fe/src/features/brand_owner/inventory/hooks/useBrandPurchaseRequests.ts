import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/src/core/api/axios-instance';
import { toast } from 'sonner';

export const useGetBrandPurchaseRequests = (brandId: string, page: number = 1, limit: number = 10, status?: string, restaurantId?: string) => {
  return useQuery({
    queryKey: ['brand_purchase_requests', brandId, page, limit, status, restaurantId],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/brand-owner/${brandId}/purchase-request`, {
        params: { page, limit, status, restaurantId }
      });
      return data;
    },
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};

export const useRejectPurchaseRequests = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandId, requestIds }: { brandId: string, requestIds: string[] }) => {
      const { data } = await axiosClient.post(`/brand-owner/${brandId}/purchase-request/reject`, { requestIds });
      return data;
    },
    onSuccess: () => {
      toast.success("Đã từ chối các Yêu cầu nhập kho được chọn");
      queryClient.invalidateQueries({ queryKey: ['brand_purchase_requests'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi từ chối yêu cầu");
    }
  });
};
