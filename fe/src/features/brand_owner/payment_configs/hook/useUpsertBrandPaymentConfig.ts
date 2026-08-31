import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertBrandPaymentConfigService } from "../service/brand_payment.service";

export const useUpsertBrandPaymentConfig = (brandId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ systemPaymentMethodId, payload }: { systemPaymentMethodId: string; payload: any }) =>
            upsertBrandPaymentConfigService(brandId, systemPaymentMethodId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["BRAND_PAYMENT_CONFIGS", brandId] });
            toast.success(data.message || "Cập nhật cấu hình cổng thanh toán thành công!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Có lỗi xảy ra khi lưu cấu hình";
            toast.error(message);
        }
    });
};
