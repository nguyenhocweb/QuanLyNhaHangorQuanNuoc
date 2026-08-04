import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAreaService } from "../service/area.create.service";
import { toast } from "sonner";

export const useCreateArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) => createAreaService(payload),
        onSuccess: () => {
            toast.success("Tạo khu vực thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo khu vực");
        }
    });
};
