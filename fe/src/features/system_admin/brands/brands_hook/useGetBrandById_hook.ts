import { useQuery } from "@tanstack/react-query";
import { getBrandByIdService } from "../brands_services/getBrandById_service";

export const useGetBrandById = (id: string) => {
    return useQuery({
        queryKey: ["BrandDetail", id],
        queryFn: () => getBrandByIdService(id),
        enabled: !!id,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
