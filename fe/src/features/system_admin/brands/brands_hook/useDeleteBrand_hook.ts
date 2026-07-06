import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBrandService } from "../brands_services/Brand_service";
import toast from "react-hot-toast";

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBrandService(id),
        onSuccess: () => {
            toast.success("Xóa thương hiệu thành công!");
            queryClient.invalidateQueries({ queryKey: ["brandPage"] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Xóa thương hiệu thất bại!";
            toast.error(errorMessage);
        }
    });
};
