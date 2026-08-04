import { useQuery } from "@tanstack/react-query";
import { getSystemReviewsService } from "../service/review.get.service";

export const useGetSystemReviews = (params: any) => {
    return useQuery({
        queryKey: ['system-reviews', params],
        queryFn: () => getSystemReviewsService(params),
        staleTime: 60 * 1000,
    });
};
