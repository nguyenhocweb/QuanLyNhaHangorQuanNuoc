import { useQuery } from "@tanstack/react-query";
import { getFeaturedReviewsService } from "../service/review.get-featured.service";

export const useGetFeaturedReviews = (limit = 9) => {
    return useQuery({
        queryKey: ["PUBLIC_FEATURED_REVIEWS", limit],
        queryFn: () => getFeaturedReviewsService(limit),
        staleTime: 60 * 1000, // cache 1 phút theo quy tắc kiến trúc
        refetchOnWindowFocus: false,
    });
};
