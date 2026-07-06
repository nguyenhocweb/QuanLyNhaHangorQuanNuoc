
import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation,useQueryClient } from "@tanstack/react-query";


import {toast} from "sonner"
import { ReservationForm } from "../reservation_schemas/createReservation_schemas";
import { createReservation_service } from "../reservation_service/createReservation_service";
export const useCreateReservation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ReservationForm) => createReservation_service(data),
        onSuccess: () => {
            toast.success("Đã đặt bàn thành công");
            queryClient.invalidateQueries({ queryKey: ['tables'] })
        },
        onError: (error) => {
            // 1. Nếu đây là lỗi do gọi API (Server ném lỗi 400, 401, 404...)
           toast.error(getErrorMessage(error))
        },
    })
}