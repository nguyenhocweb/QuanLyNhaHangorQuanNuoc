import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner"
import { publicChatBoxAiSevice } from "../chatBoxAI_service/public_chatbox_service";
export const publicChatBoxAiHook = () => {

    return useMutation({
        mutationFn:({mes,question}:{mes:any,question:string})=> publicChatBoxAiSevice(mes,question),
        onError: (error) => {             
            // 1. Nếu đây là lỗi do gọi API (Server ném lỗi 400, 401, 404...)
           toast.error(getErrorMessage(error))
        },
    })
}