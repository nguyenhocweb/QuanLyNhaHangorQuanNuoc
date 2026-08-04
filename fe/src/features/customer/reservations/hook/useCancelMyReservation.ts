import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMyReservationService } from "../service/reservation.update.service";
import { toast } from "sonner";

export const useCancelMyReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelMyReservationService,
        onSuccess: () => {
            toast.success("Hủy đặt bàn thành công!");
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_RESERVATIONS'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi hủy đặt bàn!");
        },
    });
};
