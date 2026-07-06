import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategoryRestaurantService, UpdateCategoryPayload } from "../service/UpdateCategoryRestaurant_service";
import { toast } from "sonner";

export const useUpdateCategoryRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: UpdateCategoryRestaurantService,
        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["categoryRestaurant"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
            toast.error(message);
        }
    });
};
