import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDineInOrderService } from "../service/dine_in_order.service";
import { CreateDineInOrderPayload } from "../type/dine_in_order.type";

export const useCreateDineInOrder = (reservationId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateDineInOrderPayload) => createDineInOrderService(payload),
        onSuccess: () => {
            toast.success("Gửi yêu cầu gọi món thành công! Nhà hàng đang tiếp nhận món.");
            if (reservationId) {
                queryClient.invalidateQueries({ queryKey: ['DINE_IN_ACTIVE_ORDER', reservationId] });
            }
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_ORDERS'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Không thể gửi yêu cầu gọi món, vui lòng thử lại!";
            toast.error(message);
        }
    });
};
