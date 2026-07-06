import { useQuery } from "@tanstack/react-query";
import { getBrandsService } from "../brands_services/Brand_service";

export const useGetBrands = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ["brandPage", page, limit, search],
        queryFn: () => getBrandsService(page, limit, search),
        placeholderData: (prev) => prev,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
