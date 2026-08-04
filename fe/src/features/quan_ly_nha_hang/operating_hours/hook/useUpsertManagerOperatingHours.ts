import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertManagerOperatingHoursService } from "../service/operating_hours.service";
import { IOperatingHour } from "@/src/features/brand_owner/operating_hours/type/operating_hours.type";
import { toast } from "sonner";

export const useUpsertManagerOperatingHours = (restaurantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IOperatingHour[]) => upsertManagerOperatingHoursService(restaurantId, data),
        onSuccess: () => {
            toast.success("Cập nhật giờ hoạt động thành công!");
            queryClient.invalidateQueries({ queryKey: ["manager-operating-hours", restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Cập nhật giờ hoạt động thất bại!");
        }
    });
};
