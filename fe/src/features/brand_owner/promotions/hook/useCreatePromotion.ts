import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromotionService } from "../service/promotion.create.service";
import { toast } from "sonner";

export const useCreatePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ brandId, payload }: { brandId: string; payload: any }) => createPromotionService(brandId, payload),
        onSuccess: (data, variables) => {
            toast.success("Tạo khuyến mãi thành công");
            queryClient.invalidateQueries({ queryKey: ["BrandPromotions", variables.brandId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo khuyến mãi");
        }
    });
};
