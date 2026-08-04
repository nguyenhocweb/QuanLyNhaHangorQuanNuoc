import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAreaService } from "../service/area.delete.service";
import { toast } from "sonner";

export const useDeleteArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAreaService(id),
        onSuccess: () => {
            toast.success("Xóa khu vực thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa khu vực");
        }
    });
};
