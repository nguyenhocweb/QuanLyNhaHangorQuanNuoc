import { useQuery } from "@tanstack/react-query";
import { getUnreviewedMealsService } from "../service/review.get-unreviewed.service";

export const useGetUnreviewedMeals = (params: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['CUSTOMER_UNREVIEWED_MEALS', params],
        queryFn: () => getUnreviewedMealsService(params),
        staleTime: 60 * 1000,
    });
};
