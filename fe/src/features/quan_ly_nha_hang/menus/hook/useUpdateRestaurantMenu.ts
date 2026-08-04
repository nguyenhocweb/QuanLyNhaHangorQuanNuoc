import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { updateRestaurantMenuService } from "../service/menu.update.service";

export const useUpdateRestaurantMenu = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRestaurantMenuService,
        onSuccess: (data) => {
            toast.success(data?.message || "Cập nhật trạng thái món ăn thành công!");
            queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    });
};
