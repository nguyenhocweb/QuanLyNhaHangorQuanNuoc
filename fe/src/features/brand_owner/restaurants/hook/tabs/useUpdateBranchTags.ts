import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranchTagsService } from "../../service/tabs/branch-tags.update.service";
import { toast } from "sonner";

export const useUpdateBranchTags = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBranchTagsService,
        onSuccess: (res: any, variables: any) => {
            toast.success(res.data?.message || "Cập nhật thẻ từ khóa thành công!");
            // Refetch lại chi tiết nhà hàng và tiện ích
            queryClient.invalidateQueries({ queryKey: ["RestaurantById", variables.id_brand, variables.id] });
            queryClient.invalidateQueries({ queryKey: ["RestaurantUtilities", variables.id_brand, variables.id] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thẻ từ khóa");
        }
    });
};
