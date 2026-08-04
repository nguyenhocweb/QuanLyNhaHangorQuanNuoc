import { useQuery } from "@tanstack/react-query";
import { getBrandReviewsService } from "../service/review.get.service";

export const useGetBrandReviews = (brandId: string, params: any) => {
    return useQuery({
        queryKey: ['brand-reviews', brandId, params],
        queryFn: () => getBrandReviewsService(brandId, params),
        enabled: !!brandId,
        staleTime: 60 * 1000,
    });
};
