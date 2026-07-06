import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRestaurantService } from "../service/restaurant_service";
import toast from "react-hot-toast";

export const useDeleteRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRestaurantService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurants"] });
            toast.success("Xóa nhà hàng thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
        }
    });
};
