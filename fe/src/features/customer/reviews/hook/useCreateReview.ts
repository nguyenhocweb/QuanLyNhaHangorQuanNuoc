import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReviewService } from "../service/review.create.service";
import { ReviewCreateFormValues } from "../schema/review.create.schema";

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReviewCreateFormValues) => createReviewService(data),
        onSuccess: () => {
            toast.success("Đánh giá của bạn đã được gửi thành công!");
            // Invalidate the reviews query for the restaurant
            queryClient.invalidateQueries({ queryKey: ['restaurant-reviews'] });
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_REVIEWS'] });
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_UNREVIEWED_MEALS'] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá";
            toast.error(message);
        }
    });
};
