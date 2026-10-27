import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createWebFeedbackService } from "../service/web_feedback.create.service";
import { CreateWebFeedbackFormValues } from "../schema/web_feedback.create.schema";

export const useCreateWebFeedback = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebFeedbackFormValues) => createWebFeedbackService(data),
    onSuccess: () => {
      toast.success("Cảm ơn bạn! Đánh giá góp ý của bạn đã được gửi thành công và đang chờ duyệt.");
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_WEB_FEEDBACKS"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gửi đánh giá thất bại, vui lòng thử lại!";
      toast.error(message);
    }
  });
};
