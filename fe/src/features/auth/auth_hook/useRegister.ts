import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerService } from "../auth_services/register_service";
import { RegisterFormValues, RegisterResponse } from "../auth_types/register_type";

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterFormValues) => registerService(data),
        onSuccess: (res: RegisterResponse) => {
            toast.success(res.message || "Đăng ký tài khoản thành công! Đang chuyển hướng...");
            setTimeout(() => {
                router.push("/login");
            }, 1200);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
