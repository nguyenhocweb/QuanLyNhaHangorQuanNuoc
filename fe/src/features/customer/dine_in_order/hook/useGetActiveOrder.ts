import { useQuery } from "@tanstack/react-query";
import { getActiveOrderByReservationService } from "../service/dine_in_order.service";

export const useGetActiveOrder = (reservationId: string | undefined) => {
    return useQuery({
        queryKey: ['DINE_IN_ACTIVE_ORDER', reservationId],
        queryFn: () => getActiveOrderByReservationService(reservationId!),
        enabled: !!reservationId,
        staleTime: 15 * 1000,
        refetchInterval: 15 * 1000, // Tự động đồng bộ tiến độ món ăn sau mỗi 15s
    });
};
