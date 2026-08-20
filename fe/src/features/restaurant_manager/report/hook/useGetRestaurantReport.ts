import { useQuery } from '@tanstack/react-query';
import { getRestaurantReportService } from '../service/report.get.service';

export const useGetRestaurantReport = (
  restaurantId: string | undefined,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['RestaurantReport', restaurantId, startDate, endDate],
    queryFn: () => getRestaurantReportService(restaurantId!, startDate, endDate),
    enabled: !!restaurantId,
    staleTime: 60 * 1000,
  });
};
