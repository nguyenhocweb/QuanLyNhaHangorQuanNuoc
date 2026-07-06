import { useQuery } from "@tanstack/react-query";
import { getRestaurantByIdService } from "../service/restaurant_service";

export const useGetRestaurantById = (id: string | null) => {
    return useQuery({
        queryKey: ["restaurant", id],
        queryFn: () => getRestaurantByIdService(id!),
        enabled: !!id,
        staleTime: 60 * 1000,
    });
};
