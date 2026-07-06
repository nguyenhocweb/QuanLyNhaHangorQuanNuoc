import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryRestaurantService } from "../service/CreateCategoryRestaurant_service";
import { toast } from "sonner";

export const useCreateCategoryRestaurant = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: CreateCategoryRestaurantService,
        onSuccess: () => {
            toast.success("Thêm loại hình nhà hàng thành công!");
            queryClient.invalidateQueries({ queryKey: ["categoryRestaurant"] });
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục";
            toast.error(message);
        }
    });
};
