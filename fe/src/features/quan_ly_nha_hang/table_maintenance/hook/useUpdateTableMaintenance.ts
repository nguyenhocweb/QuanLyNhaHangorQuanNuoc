import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTableMaintenanceService } from "../service/table_maintenance.update.service";
import { toast } from "sonner";
import { IUpdateTableMaintenancePayload } from "../type/table_maintenance.type";

export const useUpdateTableMaintenance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: IUpdateTableMaintenancePayload }) => updateTableMaintenanceService(id, payload),
        onSuccess: (res) => {
            toast.success(res?.message || "Cập nhật lịch bảo trì thành công!");
            queryClient.invalidateQueries({ queryKey: ["table-maintenance"] });
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
            queryClient.invalidateQueries({ queryKey: ["TABLES"] });
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật bảo trì!");
        }
    });
};
