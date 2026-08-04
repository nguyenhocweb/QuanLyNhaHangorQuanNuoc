import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRestaurantMenu } from "../service/branch-menu.service";
import { toast } from "sonner";

export const useUpdateBranchMenu = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateRestaurantMenu,
        onSuccess: (data, variables) => {
            toast.success("Cập nhật thực đơn chi nhánh thành công!");
            // Invalidate the branch menu query so the list refreshes
            queryClient.invalidateQueries({ queryKey: ["brand_menuItems"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật thực đơn chi nhánh");
        }
    });
};
