import { useQuery } from "@tanstack/react-query";
import { getRestaurantMenuService } from "../service/menu.get.service";
import { GetRestaurantMenuParams } from "../type/menu.type";

export const useGetRestaurantMenu = (restaurantId: string, params?: GetRestaurantMenuParams) => {
    return useQuery({
        queryKey: ["restaurant-menu", restaurantId, params],
        queryFn: () => getRestaurantMenuService(restaurantId, params),
        enabled: !!restaurantId,
        staleTime: 60 * 1000 // 1 phút
    });
};
