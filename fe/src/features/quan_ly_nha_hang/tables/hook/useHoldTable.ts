import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { holdTableService, HoldTableResponse } from "../service/table.hold.service";

export const useHoldTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tableId: string) => holdTableService(tableId),
        onSuccess: (data: { message: string, metadata: HoldTableResponse }) => {
            // Không cần toast success vì mình dùng Optimistic UI, trừ khi cần thiết
            // toast.success("Đang giữ bàn...");
            
            // Invalidate queries để đảm bảo dữ liệu mới nhất (dù socket đã lo phần real-time)
            queryClient.invalidateQueries({ queryKey: ["TABLES"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Không thể giữ bàn, có thể người khác đã đặt.");
            // Rollback optimistic update 
            queryClient.invalidateQueries({ queryKey: ["TABLES"] });
        }
    });
};
