import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReservationForm } from "../reservation_schemas/createReservation_schemas";
import { createReservation_service } from "../reservation_service/createReservation_service";

export const useCreateReservation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ReservationForm) => createReservation_service(data),
        onSuccess: () => {
            toast.success("Đã đặt bàn thành công");
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_RESERVATIONS'] });
            queryClient.invalidateQueries({ queryKey: ['tables'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};