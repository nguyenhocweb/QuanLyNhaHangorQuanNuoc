import { useMutation } from "@tanstack/react-query";
import { changePasswordService } from "../profile_service/changePassword_service";
import {toast} from "sonner"
import { getErrorMessage } from "@/src/core/lib/errorHandle";
export const useChangePassword=()=>{
     const mutation = useMutation({
            mutationFn: changePasswordService,
            onSuccess: (data) => {
                alert(data)
                toast.success(data.mes);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                toast.error(` ${errorMessage}`);
            }
    
        });
        return mutation;
}