import { useQuery } from "@tanstack/react-query";
import { getMyReservationsService } from "../service/reservation.get.service";

export const useGetMyReservations = (params: { page: number; limit: number; status?: string }) => {
    return useQuery({
        queryKey: ['CUSTOMER_RESERVATIONS', params],
        queryFn: () => getMyReservationsService(params),
        staleTime: 60 * 1000,
    });
};
