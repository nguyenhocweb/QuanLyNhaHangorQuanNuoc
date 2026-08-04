import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReservationService } from "../service/reservation.create.service";
import { ReservationFormValues } from "../schema/reservation.schema";

export const useCreateReservation = (restaurantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReservationFormValues) => createReservationService(restaurantId, data),
        onSuccess: () => {
            toast.success("Tạo đơn đặt bàn thành công!");
            queryClient.invalidateQueries({ queryKey: ["RESERVATIONS", restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo đặt bàn");
        }
    });
};
