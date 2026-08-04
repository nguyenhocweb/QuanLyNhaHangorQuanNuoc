import { useQuery } from "@tanstack/react-query";
import { getAvailableTablesService } from "../service/restaurant_tables.get.service";

export const useGetAvailableTables = (
    idRestaurant: string, 
    params: { date: string, time: string, endTime: string, partySize: number } | null
) => {
    return useQuery({
        queryKey: ["PUBLIC_AVAILABLE_TABLES", idRestaurant, params],
        queryFn: () => getAvailableTablesService(idRestaurant, {
            date: params!.date,
            startTime: params!.time,
            endTime: params!.endTime,
            partySize: params!.partySize
        }),
        enabled: !!params,
        staleTime: 0 // Realtime feature, don't cache too long
    });
};
