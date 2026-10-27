import { useQuery } from "@tanstack/react-query";
import { getSystemReviewStatsService } from "../service/review.stats.service";

export const useGetSystemReviewStats = () => {
    return useQuery({
        queryKey: ['system-reviews-stats'],
        queryFn: () => getSystemReviewStatsService(),
        staleTime: 60 * 1000,
    });
};
