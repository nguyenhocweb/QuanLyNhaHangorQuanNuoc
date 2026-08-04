import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTableService } from "../service/table.delete.service";
import { toast } from "sonner";

export const useDeleteTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTableService(id),
        onSuccess: () => {
            toast.success("Xóa bàn thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa bàn");
        }
    });
};
