import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertOperatingHoursService } from "../service/operating_hours.upsert.service";
import { UpsertOperatingHoursFormValues } from "../schema/operating_hours.upsert.schema";
import { toast } from "sonner";

export const useUpsertOperatingHours = (id_brand: string, idRestaurant: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpsertOperatingHoursFormValues) => upsertOperatingHoursService(id_brand, idRestaurant, data),
        onSuccess: () => {
            toast.success("Cập nhật giờ hoạt động thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_owner", id_brand, "restaurant", idRestaurant, "operating_hours"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Cập nhật giờ hoạt động thất bại!");
        }
    });
};
