import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PromotionCreateFormValues } from '../schema/promotion.create.schema';
import { createPromotionService } from '../service/promotion.create.service';

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PromotionCreateFormValues & { restaurantId: string }) => createPromotionService(data as any),
    onSuccess: () => {
      toast.success('Đã tạo chiến dịch khuyến mãi thành công!');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo chiến dịch!');
    },
  });
};
