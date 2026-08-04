import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTableMaintenanceService } from "../service/table_maintenance.create.service";
import { toast } from "sonner";

export const useCreateTableMaintenance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTableMaintenanceService,
        onSuccess: (res) => {
            toast.success(res?.message || "Lên lịch bảo trì thành công!");
            queryClient.invalidateQueries({ queryKey: ["table-maintenance"] });
            queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
            queryClient.invalidateQueries({ queryKey: ["TABLES"] });
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi lên lịch bảo trì!");
        }
    });
};
