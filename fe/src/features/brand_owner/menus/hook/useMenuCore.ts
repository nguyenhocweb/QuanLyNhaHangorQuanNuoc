import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenus, createMenu, updateMenu, deleteMenu } from "../service/menu_core.service";
import { toast } from "sonner";

export const useGetMenus = (params: { page: number; limit: number; search?: string; is_active?: boolean | string; sort_order?: number | string }) => {
    return useQuery({
        queryKey: ["brand_menus", params.page, params.limit, params.search, params.is_active, params.sort_order],
        queryFn: () => getMenus(params),
        staleTime: 60 * 1000,
    });
};

export const useCreateMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMenu,
        onSuccess: () => {
            toast.success("Tạo thực đơn thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menus"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi tạo thực đơn");
        }
    });
};

export const useUpdateMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMenu,
        onSuccess: () => {
            toast.success("Cập nhật thực đơn thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menus"] });
            queryClient.invalidateQueries({ queryKey: ["brand_menuCategories"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật thực đơn");
        }
    });
};

export const useDeleteMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMenu,
        onSuccess: () => {
            toast.success("Xóa thực đơn thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menus"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi xóa thực đơn");
        }
    });
};
