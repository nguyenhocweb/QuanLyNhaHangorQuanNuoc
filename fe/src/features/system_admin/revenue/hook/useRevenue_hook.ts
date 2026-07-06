import { useQuery } from "@tanstack/react-query";
import { getRevenueListService } from "../service/revenue_service";

export const useRevenueList = (filters: { month?: number | null; year?: number | null; page?: number; limit?: number; planName?: string; status?: string; search?: string }) => {
    return useQuery({
        queryKey: ["admin_revenue_list", filters],
        queryFn: () => getRevenueListService(filters),
        staleTime: 60 * 1000,
    });
};
