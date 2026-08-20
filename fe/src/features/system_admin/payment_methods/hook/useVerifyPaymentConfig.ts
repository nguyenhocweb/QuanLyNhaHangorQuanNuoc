import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyAdminPaymentConfigService } from "../service/payment.verify.service";

export const useVerifyPaymentConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (systemPaymentMethodId: string) => verifyAdminPaymentConfigService(systemPaymentMethodId),
        onSuccess: (data, variables) => {
            if (data.status === 'VERIFIED') {
                toast.success("Phương thức đã được kiểm định tự động thành công!");
                queryClient.invalidateQueries({ queryKey: ["adminPaymentConfig", variables] });
            } else {
                toast.success("Tạo mã Test 1,000đ thành công. Vui lòng quét mã để kiểm định!");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo mã kiểm định");
        }
    });
};
