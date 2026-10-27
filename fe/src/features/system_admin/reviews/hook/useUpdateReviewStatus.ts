import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReviewStatusService } from "../service/review.status.service";
import { ReviewStatusFormValues } from "../schema/review.status.schema";

export const useUpdateReviewStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, data }: { reviewId: string, data: ReviewStatusFormValues }) => 
            updateReviewStatusService(reviewId, data),
        onSuccess: (_, variables) => {
            if (variables.data.is_public) {
                toast.success("Đã công khai hiển thị đánh giá!");
            } else {
                toast.success("Đã ẩn đánh giá khỏi hệ thống!");
            }
            queryClient.invalidateQueries({ queryKey: ['system-reviews'] });
            queryClient.invalidateQueries({ queryKey: ['system-reviews-stats'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái";
            toast.error(message);
        }
    });
};
