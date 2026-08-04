import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePromotionService } from "../service/promotion.delete.service";
import { toast } from "sonner";

export const useDeletePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ brandId, promotionId }: { brandId: string; promotionId: string }) => deletePromotionService(brandId, promotionId),
        onSuccess: (data, variables) => {
            toast.success("Xóa khuyến mãi thành công");
            queryClient.invalidateQueries({ queryKey: ["BrandPromotions", variables.brandId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa khuyến mãi");
        }
    });
};
