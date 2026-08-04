import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReviewService } from "../service/review.update.service";
import { ReviewUpdateFormValues } from "../schema/review.update.schema";

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, data }: { reviewId: string; data: ReviewUpdateFormValues }) => updateReviewService(reviewId, data),
        onSuccess: (res) => {
            toast.success(res.message || "Cập nhật đánh giá thành công!");
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_REVIEWS'] });
            queryClient.invalidateQueries({ queryKey: ['restaurant-reviews'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật đánh giá";
            toast.error(message);
        }
    });
};
