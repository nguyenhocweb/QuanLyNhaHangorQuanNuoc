import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTableService } from "../service/table.update.service";
import { toast } from "sonner";

export const useUpdateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: string; payload: any }) => updateTableService(data),
        onSuccess: () => {
            toast.success("Cập nhật thông tin bàn thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật bàn");
        }
    });
};
