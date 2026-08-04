import { useQuery } from "@tanstack/react-query";
import { getPublicRestaurantHoursService } from "../service/restaurant.public.service";

export const useGetPublicRestaurantHours = (id: string) => {
    return useQuery({
        queryKey: ["publicRestaurantHours", id],
        queryFn: async () => {
            const res = await getPublicRestaurantHoursService(id);
            return res.metadata;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};
