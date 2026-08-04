import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTableService } from "../service/table.create.service";
import { toast } from "sonner";

export const useCreateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) => createTableService(payload),
        onSuccess: () => {
            toast.success("Thêm bàn thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi thêm bàn");
        }
    });
};
