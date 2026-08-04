import { useQuery } from "@tanstack/react-query";
import { getPublicRestaurantCoreService } from "../service/restaurant.public.service";

export const useGetPublicRestaurantCore = (id: string) => {
    return useQuery({
        queryKey: ["publicRestaurantCore", id],
        queryFn: async () => {
            const res = await getPublicRestaurantCoreService(id);
            return res.metadata;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 phút cache cho thông tin core
    });
};
