import { useQuery } from "@tanstack/react-query";
import { getMyBrandRestaurantsService } from "../service/my_brand_restaurants.get.service";

export const useGetMyBrandRestaurants = () => {
    return useQuery({
        queryKey: ["myBrandRestaurants"],
        queryFn: async () => {
            const res = await getMyBrandRestaurantsService();
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });
};
