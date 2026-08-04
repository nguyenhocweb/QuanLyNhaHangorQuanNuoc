import { useQuery } from "@tanstack/react-query";
import { getReportService } from "../service/report.get.service";

export const useGetReport = (brandId: string, filters?: { startDate?: string; endDate?: string }) => {
    return useQuery({
        queryKey: ["BrandReport", brandId, filters],
        queryFn: () => getReportService(brandId, filters),
        enabled: !!brandId,
        staleTime: 60 * 1000 // 1 minute cache
    });
};
