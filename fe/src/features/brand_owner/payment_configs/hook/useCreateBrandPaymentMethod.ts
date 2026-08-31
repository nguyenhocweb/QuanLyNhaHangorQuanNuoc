import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBrandPaymentMethodService } from "../service/brand_payment.service";

export const useCreateBrandPaymentMethod = (brandId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: {
            name: string;
            code: string;
            description?: string;
            iconUrl?: string;
            isActive?: boolean;
        }) => createBrandPaymentMethodService(brandId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["BRAND_PAYMENT_CONFIGS", brandId] });
            toast.success(data.message || "Tạo phương thức thanh toán mới thành công!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo phương thức thanh toán";
            toast.error(message);
        }
    });
};
