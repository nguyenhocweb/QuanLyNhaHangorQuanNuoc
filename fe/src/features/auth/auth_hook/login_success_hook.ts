

import { useMutation } from "@tanstack/react-query";
import { User } from "../auth_types/login_type";
import { loginSuccessSevice } from "../auth_services/login_success_service";
import {toast} from "sonner";

import { useRouter } from "next/navigation";
import { useShallow } from 'zustand/react/shallow';
//Zustand cung cấp một hook để so sánh nông (shallow compare) các thuộc tính bên trong Object.
//  Nếu các giá trị bên trong không đổi, 
// nó sẽ không kích hoạt render lại.
import {useAuthStore} from "../auth_store/use-auth-store"
import { getErrorMessage } from "@/src/core/lib/errorHandle";
export const useLoginSuccess = () => {
    const {setUser} =useAuthStore(useShallow((state) => ({
            setUser: state.login
        })));
        const route=useRouter();
    return useMutation({
        mutationFn: loginSuccessSevice,
        onSuccess: (data: User) => {
            setUser(data);
            if (data.systemRole === "Admin") {
                route.push("/system/dashboard");
                return;
            }

            const brandCount = data.brand ? data.brand.length : 0;
            const restCount = data.restaurant ? data.restaurant.length : 0;
            const totalWorkspaces = brandCount + restCount;

            if (totalWorkspaces > 1) {
                route.push("/select-workspace");
            } else if (totalWorkspaces === 1) {
                if (brandCount === 1) {
                    route.push("/brand_owner/dashboard");
                } else if (restCount === 1) {
                    const role = data.restaurant![0].role;
                    if (role === "Quản lý nhà hàng") {
                        route.push("/quan-ly-nha-hang/dashboard");
                    } else {
                        route.push("/quan-ly-nha-hang/profile");
                    }
                }
            } else {
                route.push("/");
            }
        },
        onError: (error) => {             
            // 1. Nếu đây là lỗi do gọi API (Server ném lỗi 400, 401, 404...)
            toast.error(getErrorMessage(error))
        },
    })
}