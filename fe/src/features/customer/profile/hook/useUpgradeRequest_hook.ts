import { useMutation } from "@tanstack/react-query";
import { createUpgradeRequest } from "../service/upgrade_service";
import toast from "react-hot-toast";

export const useCreateUpgradeRequest = () => {
    return useMutation({
        mutationFn: createUpgradeRequest,
        onSuccess: () => {
            toast.success("Đã gửi yêu cầu đăng ký đối tác thành công!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.");
        }
    });
};
