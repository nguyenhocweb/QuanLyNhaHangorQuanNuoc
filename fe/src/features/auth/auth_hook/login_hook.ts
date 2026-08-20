import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "../auth_types/login_type";
import { loginSevice } from "../auth_services/login_service";

import {toast} from "sonner"

import {useAuthStore} from "../auth_store/use-auth-store";
import { useRouter } from "next/navigation";
export const useLogin = () => {
    const setUser=useAuthStore(state=>state.login);
    const router=useRouter();
    return useMutation({
        mutationFn: loginSevice,
        onSuccess: (data: LoginResponse) => {
            setUser(data);
            if (data.systemRole === "Admin") {
                router.push("/system/dashboard");
                return;
            }

            const brandCount = data.brand ? data.brand.length : 0;
            const restCount = data.restaurant ? data.restaurant.length : 0;
            const totalWorkspaces = brandCount + restCount;

            if (totalWorkspaces > 1) {
                router.push("/select-workspace");
            } else if (totalWorkspaces === 1) {
                if (brandCount === 1) {
                    router.push("/brand_owner/dashboard");
                } else if (restCount === 1) {
                    const role = data.restaurant![0].role;
                    if (role === "Quản lý nhà hàng") {
                        router.push("/quan-ly-nha-hang/dashboard");
                    } else {
                        router.push("/quan-ly-nha-hang/profile");
                    }
                }
            } else {
                router.push("/");
            }
        },
        onError: (error) => {             
            // 1. Nếu đây là lỗi do gọi API (Server ném lỗi 400, 401, 404...)
           toast.error(getErrorMessage(error))
        },
    })
}