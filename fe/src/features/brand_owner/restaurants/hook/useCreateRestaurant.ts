import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRestaurantService } from "../service/restaurant.create.service";
import { toast } from "sonner";

export const useCreateRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRestaurantService,
        onSuccess: (res: any) => {
            toast.success(res.message || "Tạo chi nhánh thành công!");
            queryClient.invalidateQueries({ queryKey: ["BrandRestaurants"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        }
    });
};
