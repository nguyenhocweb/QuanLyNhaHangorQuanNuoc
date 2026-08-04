import { useQuery } from "@tanstack/react-query";
import { getManagerOperatingHoursService } from "../service/operating_hours.service";

export const useGetManagerOperatingHours = (restaurantId: string) => {
    return useQuery({
        queryKey: ["manager-operating-hours", restaurantId],
        queryFn: async () => {
            const res = await getManagerOperatingHoursService(restaurantId);
            return res.metadata;
        },
        enabled: !!restaurantId,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
};
