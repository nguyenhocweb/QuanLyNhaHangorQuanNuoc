import { useQuery } from "@tanstack/react-query";
import { getOperatingHoursService } from "../service/operating_hours.get.service";

export const useGetOperatingHours = (id_brand: string, idRestaurant: string) => {
    return useQuery({
        queryKey: ["brand_owner", id_brand, "restaurant", idRestaurant, "operating_hours"],
        queryFn: () => getOperatingHoursService(id_brand, idRestaurant),
        enabled: !!id_brand && !!idRestaurant,
        staleTime: 60 * 1000
    });
};
