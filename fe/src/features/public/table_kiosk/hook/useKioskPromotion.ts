import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    applyKioskPromotionService, 
    removeKioskPromotionService, 
    ApplyKioskPromotionPayload 
} from "../service/kiosk.order.service";
import { toast } from "sonner";

export const useKioskPromotion = () => {
    const queryClient = useQueryClient();

    const applyMutation = useMutation({
        mutationFn: (payload: ApplyKioskPromotionPayload) => applyKioskPromotionService(payload),
        onSuccess: (data, variables) => {
            toast.success(data?.message || "Áp dụng mã giảm giá thành công!");
            queryClient.invalidateQueries({
                queryKey: ['KIOSK_SESSION', variables.restaurantId, variables.tableId]
            });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Không thể áp dụng mã giảm giá này";
            toast.error(message);
        }
    });

    const removeMutation = useMutation({
        mutationFn: (payload: { restaurantId: string; tableId: string }) => removeKioskPromotionService(payload),
        onSuccess: (data, variables) => {
            toast.success(data?.message || "Đã gỡ bỏ mã giảm giá");
            queryClient.invalidateQueries({
                queryKey: ['KIOSK_SESSION', variables.restaurantId, variables.tableId]
            });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Không thể gỡ bỏ mã giảm giá";
            toast.error(message);
        }
    });

    return {
        applyPromotion: applyMutation.mutate,
        isApplying: applyMutation.isPending,
        removePromotion: removeMutation.mutate,
        isRemoving: removeMutation.isPending
    };
};
