import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReservationStatusService } from "../service/reservation.status.service";
import { ReservationStatus } from "../type/reservation.type";

export const useUpdateReservationStatus = (restaurantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, cancellation_reason }: { id: string; status: ReservationStatus; cancellation_reason?: string }) => 
            updateReservationStatusService(restaurantId, id, status, cancellation_reason),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công!");
            queryClient.invalidateQueries({ queryKey: ["RESERVATIONS", restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
        }
    });
};
