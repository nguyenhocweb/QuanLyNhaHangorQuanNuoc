import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicRestaurantReviewsService } from "../service/restaurant.public.service";

export const useGetPublicRestaurantReviews = (id: string, limit: number = 10, rating: number | null = null, sortBy: string = "latest", hasImage: boolean = false) => {
    return useInfiniteQuery({
        queryKey: ["publicRestaurantReviews", id, rating, sortBy, hasImage],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getPublicRestaurantReviewsService(id, pageParam, limit, rating, sortBy, hasImage);
            return res.metadata;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};
