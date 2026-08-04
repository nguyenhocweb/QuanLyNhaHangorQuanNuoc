import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveTableLayoutService } from "../service/table.saveLayout.service";
import { toast } from "sonner";

export const useSaveTableLayout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { area_id: string, tables: any[], obstacles: any[], background_url?: string, width?: number, height?: number }) => saveTableLayoutService(payload),
        onSuccess: () => {
            toast.success("Lưu sơ đồ thành công");
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu sơ đồ");
        }
    });
};
