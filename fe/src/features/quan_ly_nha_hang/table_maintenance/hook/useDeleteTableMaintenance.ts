import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTableMaintenanceService } from "../service/table_maintenance.delete.service";
import { toast } from "sonner";

export const useDeleteTableMaintenance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTableMaintenanceService,
        onSuccess: (res) => {
            toast.success(res?.message || "Xóa lịch bảo trì thành công!");
            queryClient.invalidateQueries({ queryKey: ["table-maintenance"] });
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
            queryClient.invalidateQueries({ queryKey: ["TABLES"] });
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi xóa lịch bảo trì!");
        }
    });
};
