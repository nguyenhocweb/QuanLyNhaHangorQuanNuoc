import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranchCategoriesService } from "@/src/features/brand_owner/restaurants/service/tabs/branch-categories.update.service";
import { toast } from "sonner";

export const useUpdateBranchCategories = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBranchCategoriesService,
        onSuccess: (res: any, variables: any) => {
            toast.success(res.data?.message || "Cập nhật danh mục thành công!");
            // Refetch lại chi tiết nhà hàng và danh sách utilities
            queryClient.invalidateQueries({ queryKey: ["RestaurantById", variables.id_brand, variables.id] });
            queryClient.invalidateQueries({ queryKey: ["RestaurantUtilities", variables.id_brand, variables.id] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục");
        }
    });
};
