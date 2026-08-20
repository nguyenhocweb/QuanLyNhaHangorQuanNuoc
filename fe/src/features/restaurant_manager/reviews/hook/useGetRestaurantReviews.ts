import { useQuery } from "@tanstack/react-query";
import { getRestaurantReviewsService } from "../service/review.get.service";

export const useGetRestaurantReviews = (restaurantId: string | undefined, params: any) => {
    return useQuery({
        queryKey: ['restaurant-reviews', restaurantId, params],
        queryFn: () => getRestaurantReviewsService(restaurantId as string, params),
        enabled: !!restaurantId,
        staleTime: 60 * 1000,
    });
};
