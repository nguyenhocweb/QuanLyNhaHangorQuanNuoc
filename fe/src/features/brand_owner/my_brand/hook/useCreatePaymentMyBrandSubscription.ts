import { useMutation } from "@tanstack/react-query";
import { createMyBrandPaymentService } from "../service/my_brand_subscription.create_payment.service";
import toast from "react-hot-toast";

export const useCreatePaymentMyBrandSubscription = () => {
    return useMutation({
        mutationFn: ({ planId, systemPaymentMethodId }: { planId: string, systemPaymentMethodId?: string }) => 
            createMyBrandPaymentService(planId, systemPaymentMethodId),
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Đã có lỗi xảy ra khi tạo mã thanh toán";
            toast.error(message);
        }
    });
};
