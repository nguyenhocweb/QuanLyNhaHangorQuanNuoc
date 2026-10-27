import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createServiceCallService, CreateServiceCallPayload } from "../service/kiosk.service_call.service";

export const useKioskServiceCall = () => {
    return useMutation({
        mutationFn: (payload: CreateServiceCallPayload) => createServiceCallService(payload),
        onSuccess: (res: any) => {
            toast.success(res?.message || "Đã gửi yêu cầu tới nhân viên phục vụ!");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi gọi phục vụ";
            toast.error(message);
        }
    });
};
