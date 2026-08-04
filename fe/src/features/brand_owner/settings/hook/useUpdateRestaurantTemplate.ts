import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRestaurantTemplateService } from "../service/settings.update_restaurant_template.service";
import { toast } from "sonner";

export const useUpdateRestaurantTemplate_hook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { brandId: string, templateId: string }) => {
            return await updateRestaurantTemplateService(data);
        },
        onSuccess: (data) => {
            toast.success(data.message || "Cập nhật mẫu giao diện cho tất cả chi nhánh thành công!");
            // Invalidate restaurants list
            queryClient.invalidateQueries({ queryKey: ["myBrandRestaurants"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Cập nhật mẫu giao diện thất bại.");
        }
    });
};
