import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreasByRestaurantIdService, createAreaService, updateAreaService, deleteAreaService } from "../service/area.service";
import { toast } from "sonner";

export const useGetAreas = (restaurantId: string) => {
    return useQuery({
        queryKey: ['BrandAreas', restaurantId],
        queryFn: () => getAreasByRestaurantIdService(restaurantId),
        staleTime: 60 * 1000,
        enabled: !!restaurantId
    });
};

export const useCreateArea = (restaurantId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAreaService,
        onSuccess: () => {
            toast.success("Tạo khu vực thành công");
            queryClient.invalidateQueries({ queryKey: ['BrandAreas', restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo khu vực");
        }
    });
};

export const useUpdateArea = (restaurantId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAreaService,
        onSuccess: () => {
            toast.success("Cập nhật khu vực thành công");
            queryClient.invalidateQueries({ queryKey: ['BrandAreas', restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        }
    });
};

export const useDeleteArea = (restaurantId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAreaService,
        onSuccess: () => {
            toast.success("Xóa khu vực thành công");
            queryClient.invalidateQueries({ queryKey: ['BrandAreas', restaurantId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa");
        }
    });
};
