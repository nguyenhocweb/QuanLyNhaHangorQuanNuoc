import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePromotionService } from "../service/promotion.update.service";
import { toast } from "sonner";

export const useUpdatePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ brandId, promotionId, payload }: { brandId: string; promotionId: string; payload: any }) => updatePromotionService(brandId, promotionId, payload),
        onSuccess: (data, variables) => {
            toast.success("Cập nhật khuyến mãi thành công");
            queryClient.invalidateQueries({ queryKey: ["BrandPromotions", variables.brandId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật khuyến mãi");
        }
    });
};
