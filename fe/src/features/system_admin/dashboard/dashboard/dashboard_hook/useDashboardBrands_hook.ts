import { useQuery } from "@tanstack/react-query";
import { DashboardBrandService } from "../dashboard_service/dashboard_brand_service";

export const useDashboardBrands = () => {
    return useQuery({
        queryKey: ["Dashboard_brands_Admin"],
        queryFn: () => DashboardBrandService(5),
        placeholderData: prev => prev,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false
    });
};
