import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignTableService, unassignTableService } from "../service/reservation.assign.service";

export const useAssignTable = (restaurantId: string) => {
    const queryClient = useQueryClient();

    const assign = useMutation({
        mutationFn: ({ id, tableId }: { id: string; tableId: string }) => assignTableService(restaurantId, id, tableId),
        onSuccess: () => {
            toast.success("Xếp bàn thành công!");
            queryClient.invalidateQueries({ queryKey: ["RESERVATIONS", restaurantId] });
            // Cập nhật lại sơ đồ bàn nếu đang mở
            queryClient.invalidateQueries({ queryKey: ["TABLES", restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xếp bàn");
        }
    });

    const unassign = useMutation({
        mutationFn: ({ id, tableId }: { id: string; tableId: string }) => unassignTableService(restaurantId, id, tableId),
        onSuccess: () => {
            toast.success("Huỷ xếp bàn thành công!");
            queryClient.invalidateQueries({ queryKey: ["RESERVATIONS", restaurantId] });
            queryClient.invalidateQueries({ queryKey: ["TABLES", restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi huỷ xếp bàn");
        }
    });

    return { assign, unassign };
};
