import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAreaService } from "../service/area.update.service";
import { toast } from "sonner";

export const useUpdateArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: string; payload: any }) => updateAreaService(data),
        onSuccess: () => {
            toast.success("Cập nhật khu vực thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật khu vực");
        }
    });
};
