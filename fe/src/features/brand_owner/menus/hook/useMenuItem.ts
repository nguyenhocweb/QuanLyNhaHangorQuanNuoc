import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "../service/menu.service";
import { toast } from "sonner";
import { uploadFileToCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/UpdateCloudinary";
import { CloudinarySignatureService } from "@/src/features/shared/cloudinary/cloudinary_service/cloudinarySignature_service";

export const useGetMenuItems = (params: { page: number; limit: number; search?: string; categoryId?: string; menuId?: string; restaurantId?: string; isAvailable?: string; isAssigned?: string }) => {
    return useQuery({
        queryKey: ["brand_menuItems", params.page, params.limit, params.search, params.categoryId, params.menuId, params.restaurantId, params.isAvailable, params.isAssigned],
        queryFn: () => getMenuItems(params),
        staleTime: 60 * 1000,
    });
};

export const useCreateMenuItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ payload, imageFile }: { payload: any, imageFile?: File }) => {
            let imageUrl = payload.image;
            
            if (imageFile) {
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/menu_items`,
                    public_id: "item_" + Date.now()
                });
                imageUrl = await uploadFileToCloudinary(sigData, imageFile);
            }

            const finalPayload = { ...payload, image: imageUrl };
            return createMenuItem(finalPayload);
        },
        onSuccess: () => {
            toast.success("Tạo món ăn thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menuItems"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi tạo món ăn");
        }
    });
};

export const useUpdateMenuItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, data, imageFile, successMessage }: { id: string; data: any; imageFile?: File; successMessage?: string }) => {
            let imageUrl = data.image;
            
            if (imageFile) {
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/menu_items`,
                    public_id: "item_" + Date.now()
                });
                imageUrl = await uploadFileToCloudinary(sigData, imageFile);
            }

            const finalPayload = { ...data, image: imageUrl };
            return updateMenuItem({ id, data: finalPayload });
        },
        onSuccess: (data, variables) => {
            toast.success(variables.successMessage || "Cập nhật món ăn thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menuItems"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật món ăn");
        }
    });
};

export const useDeleteMenuItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (variables: { id: string; successMessage?: string }) => deleteMenuItem(variables.id),
        onSuccess: (data, variables) => {
            toast.success(variables.successMessage || "Xóa món ăn thành công!");
            queryClient.invalidateQueries({ queryKey: ["brand_menuItems"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi xóa món ăn");
        }
    });
};
