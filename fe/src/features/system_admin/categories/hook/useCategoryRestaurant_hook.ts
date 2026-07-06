import { useQuery } from "@tanstack/react-query";
import { CategoryRestaurantService } from "../service/CategoryRestaurant_service";

interface UseCategoryRestaurantProps {
    page: number;
    limit: number;
    search: string;
    status: string;
}

export const useCategoryRestaurant = ({ page, limit, search, status }: UseCategoryRestaurantProps) => {
    return useQuery({
        queryKey: ["categoryRestaurant", page, limit, search, status],
        queryFn: () => CategoryRestaurantService({ page, limit, search, status }),
        placeholderData: (pev) => pev,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });
};