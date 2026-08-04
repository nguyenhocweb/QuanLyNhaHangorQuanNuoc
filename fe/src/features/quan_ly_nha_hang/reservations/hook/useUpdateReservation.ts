import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReservationService } from "../service/reservation.update.service";
import { ReservationFormValues } from "../schema/reservation.schema";

export const useUpdateReservation = (restaurantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ReservationFormValues> }) => updateReservationService(restaurantId, id, data),
        onSuccess: () => {
            toast.success("Cập nhật đơn đặt bàn thành công!");
            queryClient.invalidateQueries({ queryKey: ["RESERVATIONS", restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        }
    });
};
