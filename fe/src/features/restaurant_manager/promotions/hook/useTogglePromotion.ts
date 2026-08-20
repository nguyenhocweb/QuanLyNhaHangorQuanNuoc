import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { togglePromotionService } from '../service/promotion.toggle.service';


export const useTogglePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const result = await togglePromotionService(id);
      return result;
    },
    onSuccess: (data) => {
      toast.success(`Đã thay đổi trạng thái khuyến mãi thành công!`);
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái khuyến mãi!');
    },
  });
};
