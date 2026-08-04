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
            if (variables.data.status === 'APPROVED') {
                toast.success("Đã duyệt đánh giá công khai!");
            } else if (variables.data.status === 'REJECTED_SPAM') {
                toast.success("Đã chặn đánh giá (Spam)!");
            } else {
                toast.success("Đã cập nhật trạng thái!");
            }
            queryClient.invalidateQueries({ queryKey: ['system-reviews'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
            toast.error(message);
        }
    });
};
