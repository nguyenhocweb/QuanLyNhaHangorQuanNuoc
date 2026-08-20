import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReviewStatusService } from "../service/review.status.service";
import { ReviewStatus } from "../type/review.type";
import { toast } from "sonner";

export const useUpdateReviewStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, restaurantId }: { id: string; status: ReviewStatus, restaurantId?: string }) => updateReviewStatusService(id, status, restaurantId),
        onSuccess: () => {
            toast.success("Đã cập nhật trạng thái");
            queryClient.invalidateQueries({ queryKey: ["REVIEWS"] });
        },
        onError: () => {
            toast.error("Cập nhật trạng thái thất bại");
        }
    });
};