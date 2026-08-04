import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranchAmenitiesService } from "../../service/tabs/branch-amenities.update.service";
import { toast } from "sonner";

export const useUpdateBranchAmenities = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBranchAmenitiesService,
        onSuccess: (res: any, variables: any) => {
            toast.success(res.data?.message || "Cập nhật tiện ích thành công!");
            // Refetch lại chi tiết nhà hàng và danh sách utilities
            queryClient.invalidateQueries({ queryKey: ["RestaurantById", variables.id_brand, variables.id] });
            queryClient.invalidateQueries({ queryKey: ["RestaurantUtilities", variables.id_brand, variables.id] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật tiện ích");
        }
    });
};
