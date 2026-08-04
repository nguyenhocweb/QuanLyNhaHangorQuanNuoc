import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRestaurantService } from "../service/restaurant.update.service";
import { toast } from "sonner";

export const useUpdateRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRestaurantService,
        onSuccess: (res: any) => {
            toast.success(res.data?.message || "Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["BrandRestaurants"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        }
    });
};
