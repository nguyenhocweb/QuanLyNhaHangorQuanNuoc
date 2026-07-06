import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRestaurantService } from "../service/restaurant_service";
import toast from "react-hot-toast";

export const useCreateRestaurant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRestaurantService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurants"] });
            toast.success("Thêm nhà hàng thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
        }
    });
};
