import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePurchaseOrderService } from '../service/purchase_order.update.service';
import { toast } from 'sonner';

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, poId, data }: { brandId: string; poId: string; data: any }) => 
      updatePurchaseOrderService(brandId, poId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase_orders', variables.brandId] });
      toast.success('Cập nhật đơn nhập hàng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn nhập hàng');
    },
  });
};
