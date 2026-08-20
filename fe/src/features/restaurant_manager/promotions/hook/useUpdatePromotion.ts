import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updatePromotionService } from '../service/promotion.update.service';

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const result = await updatePromotionService(id, data);
      return result;
    },
    onSuccess: () => {
      toast.success('Đã cập nhật khuyến mãi thành công!');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khuyến mãi!');
    },
  });
};
