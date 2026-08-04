import { useQuery } from "@tanstack/react-query";
import { getRestaurantsService } from "../service/restaurant.get.service";

export const useGetRestaurants = (id_brand: string) => {
    return useQuery({
        queryKey: ["BrandRestaurants", id_brand],
        queryFn: async () => {
            if (!id_brand) return [];
            const { data } = await getRestaurantsService(id_brand);
            return data;
        },
        enabled: !!id_brand,
        staleTime: 60 * 1000,
    });
};
