import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { placeKioskOrderService, PlaceKioskOrderPayload } from "../service/kiosk.order.service";

export const useKioskOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PlaceKioskOrderPayload) => placeKioskOrderService(payload),
        onSuccess: (_, variables) => {
            toast.success("Gọi món thành công! Bếp đang chuẩn bị món cho quý khách 🎉");
            queryClient.invalidateQueries({
                queryKey: ['kiosk-session', variables.restaurantId, variables.tableId]
            });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi gọi món. Vui lòng thử lại!";
            toast.error(message);
        }
    });
};
