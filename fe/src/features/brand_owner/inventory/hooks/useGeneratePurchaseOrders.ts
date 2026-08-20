import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/src/core/api/axios-instance';
import { toast } from 'sonner';

export const usePreviewSplitPurchaseRequests = () => {
  return useMutation({
    mutationFn: async ({ brandId, requestIds }: { brandId: string, requestIds: string[] }) => {
      const { data } = await axiosClient.post(`/brand-owner/${brandId}/purchase-request/preview-split`, { requestIds });
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi gom đơn");
    }
  });
};

export const useGeneratePurchaseOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandId, centralWarehouseId, groups }: { brandId: string, centralWarehouseId: string, groups: any[] }) => {
      const { data } = await axiosClient.post(`/brand-owner/${brandId}/purchase-request/generate-pos`, { centralWarehouseId, groups });
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("Tạo Hóa đơn Nhập kho (PO) thành công!");
      queryClient.invalidateQueries({ queryKey: ['brand_purchase_requests'] });
      queryClient.invalidateQueries({ queryKey: ['purchase_orders'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi tạo PO");
    }
  });
};
