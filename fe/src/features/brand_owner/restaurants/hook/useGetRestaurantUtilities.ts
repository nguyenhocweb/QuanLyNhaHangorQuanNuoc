import { useQuery } from "@tanstack/react-query";
import { getRestaurantUtilitiesService } from "../service/restaurant.get-utilities.service";

export const useGetRestaurantUtilities = (id_brand: string, id: string) => {
    return useQuery({
        queryKey: ["RestaurantUtilities", id_brand, id],
        queryFn: async () => {
            if (!id_brand || !id) return null;
            const { data } = await getRestaurantUtilitiesService(id_brand, id);
            return data;
        },
        enabled: !!id_brand && !!id,
        staleTime: 60 * 1000,
    });
};
