import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryRestaurantService } from "../service/deleteCategoryRestaurant_service";
import toast from "react-hot-toast";

export const useDeleteCategoryRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategoryRestaurantService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoryRestaurant"] });
            toast.success("Xóa danh mục thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục!");
        }
    });
};
