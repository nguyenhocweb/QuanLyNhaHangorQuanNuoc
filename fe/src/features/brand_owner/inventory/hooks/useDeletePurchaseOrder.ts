import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePurchaseOrderService } from '../service/purchase_order.delete.service';
import { toast } from 'sonner';

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, poId }: { brandId: string; poId: string }) => 
      deletePurchaseOrderService(brandId, poId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase_orders', variables.brandId] });
      toast.success('Xóa đơn nhập hàng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn nhập hàng');
    },
  });
};
