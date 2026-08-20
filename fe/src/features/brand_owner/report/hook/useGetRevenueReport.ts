import { useQuery } from '@tanstack/react-query';
import { getRevenueReportService } from '../service/report.get.service';

export const useGetRevenueReport = (
  brandId: string | undefined,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['BrandReport', brandId, startDate, endDate],
    queryFn: () => getRevenueReportService(brandId!, startDate, endDate),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
