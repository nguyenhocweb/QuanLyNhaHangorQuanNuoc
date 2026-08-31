import { useQuery } from "@tanstack/react-query";
import { getDineInMenuService } from "../service/dine_in_order.service";

export const useGetDineInMenu = (restaurantId: string | undefined) => {
    return useQuery({
        queryKey: ['DINE_IN_MENU', restaurantId],
        queryFn: () => getDineInMenuService(restaurantId!),
        enabled: !!restaurantId,
        staleTime: 60 * 1000,
    });
};
