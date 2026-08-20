import { useQuery } from "@tanstack/react-query";
import { getBrandsService } from "../brands_services/Brand_service";

export const useGetBrands = (page: number, limit: number, search?: string, status?: string, isFeatured?: string, isNew?: string) => {
    return useQuery({
        queryKey: ["brandPage", page, limit, search, status, isFeatured, isNew],
        queryFn: () => getBrandsService(page, limit, search, status, isFeatured, isNew),
        placeholderData: (prev) => prev,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
