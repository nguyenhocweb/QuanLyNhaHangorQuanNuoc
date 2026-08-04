import { useQuery } from "@tanstack/react-query";
import { getPromotionsService } from "../service/promotion.get.service";

export const useGetPromotions = (brandId: string, filters: any) => {
    return useQuery({
        queryKey: ["BrandPromotions", brandId, filters],
        queryFn: () => getPromotionsService(brandId, filters),
        staleTime: 60 * 1000,
        enabled: !!brandId
    });
};
