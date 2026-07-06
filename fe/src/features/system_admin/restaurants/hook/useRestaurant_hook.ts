import { useQuery } from "@tanstack/react-query";
import { getRestaurantService } from "../service/restaurant_service";

interface UseRestaurantProps {
    page: number;
    limit: number;
    search: string;
    status: string;
    city?: string;
    rating?: string;
    categoryId?: string;
}

export const useRestaurant = ({ page, limit, search, status, city, rating, categoryId }: UseRestaurantProps) => {
    return useQuery({
        queryKey: ["restaurants", page, limit, search, status, city, rating, categoryId],
        queryFn: () => getRestaurantService({ page, limit, search, status, city, rating, categoryId }),
        staleTime: 60 * 1000, // 1 phút không gọi lại API
    });
};
