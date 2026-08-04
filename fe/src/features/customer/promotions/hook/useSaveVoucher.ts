import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveVoucherService } from "../service/promotion.save.service";

export const useSaveVoucher = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (identifier: string) => saveVoucherService(identifier),
        onSuccess: (res) => {
            toast.success(res.message || "Đã lưu voucher vào ví thành công!");
            queryClient.invalidateQueries({ queryKey: ["CUSTOMER_VOUCHER_WALLET"] });
            queryClient.invalidateQueries({ queryKey: ["CUSTOMER_DISCOVER_VOUCHERS"] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Không thể lưu voucher này vào ví!";
            toast.error(message);
        }
    });
};
