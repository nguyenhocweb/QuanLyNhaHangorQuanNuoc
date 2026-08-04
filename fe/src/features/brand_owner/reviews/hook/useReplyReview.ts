import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { replyReviewService } from "../service/review.reply.service";
import { ReviewReplyFormValues } from "../schema/review.reply.schema";

export const useReplyReview = (brandId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, data }: { reviewId: string, data: ReviewReplyFormValues }) => 
            replyReviewService(brandId, reviewId, data),
        onSuccess: () => {
            toast.success("Đã phản hồi đánh giá!");
            queryClient.invalidateQueries({ queryKey: ['brand-reviews'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi phản hồi";
            toast.error(message);
        }
    });
};
