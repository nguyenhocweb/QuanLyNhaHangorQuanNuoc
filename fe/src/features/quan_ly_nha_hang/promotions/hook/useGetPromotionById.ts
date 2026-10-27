import { useQuery } from '@tanstack/react-query';
import { getPromotionByIdService } from '../service/promotion.get.service';

export const useGetPromotionById = (id: string | null) => {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => getPromotionByIdService(id as string),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};
