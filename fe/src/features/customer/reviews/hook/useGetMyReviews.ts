import { useQuery } from "@tanstack/react-query";
import { getMyReviewsService } from "../service/review.get-my-reviews.service";

export const useGetMyReviews = (params: { page?: number; limit?: number; status?: string; rating?: string }) => {
    return useQuery({
        queryKey: ['CUSTOMER_REVIEWS', params],
        queryFn: () => getMyReviewsService(params),
        staleTime: 60 * 1000,
    });
};
