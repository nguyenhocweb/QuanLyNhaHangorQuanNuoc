import { useQuery } from "@tanstack/react-query";
import { getRestaurantByIdService } from "../service/restaurant.get-by-id.service";

export const useGetRestaurantById = (id_brand: string, id: string) => {
    return useQuery({
        queryKey: ["RestaurantDetail", id_brand, id],
        queryFn: async () => {
            if (!id_brand || !id) return null;
            const { data } = await getRestaurantByIdService(id_brand, id);
            return data;
        },
        enabled: !!id_brand && !!id,
        staleTime: 60 * 1000,
    });
};
