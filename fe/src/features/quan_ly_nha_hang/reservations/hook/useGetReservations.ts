import { useQuery } from "@tanstack/react-query";
import { getReservationsService } from "../service/reservation.get.service";

export const useGetReservations = (restaurantId: string, params?: { date?: string; status?: string; search?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["RESERVATIONS", restaurantId, params],
        queryFn: () => getReservationsService(restaurantId, params),
        enabled: !!restaurantId,
        staleTime: 60 * 1000, // 1 phút
    });
};
