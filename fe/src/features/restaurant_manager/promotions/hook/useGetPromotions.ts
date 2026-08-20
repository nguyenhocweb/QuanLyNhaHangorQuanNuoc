import { useQuery } from '@tanstack/react-query';
import { getPromotionsService } from '../service/promotion.get.service';

export const useGetPromotions = (restaurantId: string | undefined) => {
  return useQuery({
    queryKey: ['promotions', restaurantId],
    queryFn: () => getPromotionsService(restaurantId!),
    enabled: !!restaurantId,
    staleTime: 60 * 1000,
  });
};
