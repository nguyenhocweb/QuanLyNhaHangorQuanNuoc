import { useQuery } from "@tanstack/react-query";
import { getReviewsByRestaurantService } from "../service/review.get-by-restaurant.service";

export const useGetRestaurantReviews = (restaurantId: string, params: any) => {
    return useQuery({
        queryKey: ['restaurant-reviews', restaurantId, params],
        queryFn: () => getReviewsByRestaurantService(restaurantId, params),
        enabled: !!restaurantId,
        staleTime: 60 * 1000,
    });
};
