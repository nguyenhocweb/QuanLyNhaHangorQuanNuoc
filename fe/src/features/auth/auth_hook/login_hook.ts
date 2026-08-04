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
            if (data.role === "Admin") {
                router.push("/system/dashboard");
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