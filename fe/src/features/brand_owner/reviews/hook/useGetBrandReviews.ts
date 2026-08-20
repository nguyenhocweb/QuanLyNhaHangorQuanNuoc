import { useQuery } from "@tanstack/react-query";
import { getBrandReviewsService } from "../service/review.get.service";

export const useGetBrandReviews = (brandId: string | undefined, params: any) => {
    return useQuery({
        queryKey: ['brand-reviews', brandId, params],
        queryFn: () => getBrandReviewsService(brandId as string, params),
        enabled: !!brandId,
        staleTime: 60 * 1000,
    });
};
