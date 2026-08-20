import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyReviewService } from "../service/review.reply.service";
import { toast } from "sonner";

export const useReplyReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, staff_response, restaurantId }: { id: string; staff_response: string, restaurantId?: string }) => replyReviewService(id, staff_response, restaurantId),
        onSuccess: () => {
            toast.success("Đã gửi phản hồi thành công");
            queryClient.invalidateQueries({ queryKey: ["REVIEWS"] });
        },
        onError: () => {
            toast.error("Gửi phản hồi thất bại");
        }
    });
};