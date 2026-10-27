import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAdminWebFeedbackService } from "../service/web_feedback_admin.update.service";
import { UpdateAdminFeedbackPayload } from "../type/web_feedback_admin.type";

export const useUpdateAdminWebFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminFeedbackPayload }) =>
      updateAdminWebFeedbackService(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái nhận xét thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_WEB_FEEDBACKS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_WEB_FEEDBACKS"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại!";
      toast.error(message);
    }
  });
};
