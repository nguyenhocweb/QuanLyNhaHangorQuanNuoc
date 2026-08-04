import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRestaurantMenu } from "../service/branch-menu.service";
import { toast } from "sonner";

export const useDeleteBranchMenu = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteRestaurantMenu,
        onSuccess: (data, variables) => {
            toast.success("Đã ngừng bán món ăn tại chi nhánh!");
            // Invalidate the branch menu query so the list refreshes
            queryClient.invalidateQueries({ queryKey: ["brand_menuItems"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi ngừng bán món ăn");
        }
    });
};
