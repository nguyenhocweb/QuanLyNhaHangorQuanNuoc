import { useQuery } from "@tanstack/react-query";
import { getReviewsService } from "../service/review.get.service";

export const useGetReviews = (params: any) => {
    return useQuery({
        queryKey: ["REVIEWS", "LIST", params],
        queryFn: () => getReviewsService(params),
        staleTime: 60 * 1000
    });
};