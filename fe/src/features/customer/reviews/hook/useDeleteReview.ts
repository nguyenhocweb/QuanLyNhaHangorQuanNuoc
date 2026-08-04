import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteReviewService } from "../service/review.delete.service";

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => deleteReviewService(reviewId),
        onSuccess: (res) => {
            toast.success(res.message || "Xóa bài đánh giá thành công!");
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_REVIEWS'] });
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_UNREVIEWED_MEALS'] });
            queryClient.invalidateQueries({ queryKey: ['restaurant-reviews'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi xóa đánh giá";
            toast.error(message);
        }
    });
};
