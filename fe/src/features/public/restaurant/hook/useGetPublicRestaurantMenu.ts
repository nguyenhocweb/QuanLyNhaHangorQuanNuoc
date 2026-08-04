import { useQuery } from "@tanstack/react-query";
import { getPublicRestaurantMenuService } from "../service/restaurant.public.service";

export const useGetPublicRestaurantMenu = (id: string) => {
    return useQuery({
        queryKey: ["publicRestaurantMenu", id],
        queryFn: async () => {
            const res = await getPublicRestaurantMenuService(id);
            return res.metadata;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};
