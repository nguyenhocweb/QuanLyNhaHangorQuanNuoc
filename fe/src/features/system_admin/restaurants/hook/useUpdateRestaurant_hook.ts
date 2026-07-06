import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRestaurantService } from "../service/restaurant_service";
import toast from "react-hot-toast";

export const useUpdateRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRestaurantService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurants"] });
            toast.success("Cập nhật nhà hàng thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
        }
    });
};
