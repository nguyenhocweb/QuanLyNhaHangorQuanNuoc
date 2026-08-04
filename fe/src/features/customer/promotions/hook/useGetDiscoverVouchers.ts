import { useQuery } from "@tanstack/react-query";
import { getDiscoverPromotionsService } from "../service/promotion.get-discover.service";

interface UseGetDiscoverParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
}

export const useGetDiscoverVouchers = (params: UseGetDiscoverParams = {}) => {
    return useQuery({
        queryKey: ["CUSTOMER_DISCOVER_VOUCHERS", params.page, params.limit, params.search, params.type],
        queryFn: () => getDiscoverPromotionsService(params),
        staleTime: 60 * 1000
    });
};
