import { useQuery } from "@tanstack/react-query";
import { getMyLoyaltyHistoryService, getMyLoyaltyInfoService } from "../service/loyalty.get.service";

export const useGetLoyaltyInfo = () => {
    return useQuery({
        queryKey: ["customer-loyalty-info"],
        queryFn: () => getMyLoyaltyInfoService(),
        staleTime: 60 * 1000
    });
};

export const useGetLoyaltyHistory = (params?: { brandId?: string, restaurantId?: string }) => {
    return useQuery({
        queryKey: ["customer-loyalty-history", params],
        queryFn: () => getMyLoyaltyHistoryService(params),
        staleTime: 60 * 1000
    });
};
