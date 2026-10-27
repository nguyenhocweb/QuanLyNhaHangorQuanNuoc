import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelTableKioskOrderItemService, CancelKioskOrderItemPayload } from "../service/kiosk.order.service";
import { toast } from "sonner";

export const useKioskCancelItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CancelKioskOrderItemPayload) => cancelTableKioskOrderItemService(payload),
        onSuccess: (data, variables) => {
            toast.success(data?.message || "Đã hủy món thành công!");
            // Invalidate session to update the active order in real-time
            queryClient.invalidateQueries({
                queryKey: ['KIOSK_SESSION', variables.restaurantId, variables.tableId]
            });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Không thể hủy món ăn này";
            toast.error(message);
        }
    });
};
