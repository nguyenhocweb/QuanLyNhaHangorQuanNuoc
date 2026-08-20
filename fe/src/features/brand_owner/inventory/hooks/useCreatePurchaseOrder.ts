import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPurchaseOrderService } from '../service/purchase_order.create.service';
import { toast } from 'sonner';
import { CreatePurchaseOrderFormValues } from '../schemas/purchase_order.schema';

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, data }: { brandId: string; data: CreatePurchaseOrderFormValues }) => 
      createPurchaseOrderService(brandId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase_orders', variables.brandId] });
      toast.success('Tạo đơn nhập hàng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn nhập hàng');
    },
  });
};
