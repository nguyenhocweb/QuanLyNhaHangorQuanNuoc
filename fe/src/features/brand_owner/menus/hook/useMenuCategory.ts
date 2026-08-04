import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuCategories, createMenuCategory, updateMenuCategory, deleteMenuCategory } from "../service/menu.service";
import { toast } from "sonner";

export const useGetMenuCategories = (params: { page: number; limit: number; search?: string; is_active?: string | boolean; sort_order?: string | number }) => {
    return useQuery({
        queryKey: ["brand_menuCategories", params.page, params.limit, params.search, params.is_active, params.sort_order],
        queryFn: () => getMenuCategories(params),
        staleTime: 60 * 1000,
    });
};

export const useCreateMenuCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createMenuCategory,
        onSuccess: () => {
            toast.success("Tạo danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menuCategories"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi tạo danh mục");
        }
    });
};

export const useUpdateMenuCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (variables: { id: string; data: any; successMessage?: string }) => updateMenuCategory({ id: variables.id, data: variables.data }),
        onSuccess: (data, variables) => {
            toast.success(variables.successMessage || "Cập nhật danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menuCategories"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật danh mục");
        }
    });
};

export const useDeleteMenuCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (variables: { id: string; successMessage?: string }) => deleteMenuCategory(variables.id),
        onSuccess: (data, variables) => {
            toast.success(variables.successMessage || "Xóa danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menuCategories"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi xóa danh mục");
        }
    });
};
