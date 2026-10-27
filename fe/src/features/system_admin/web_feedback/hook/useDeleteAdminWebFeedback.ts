import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAdminWebFeedbackService } from "../service/web_feedback_admin.delete.service";

export const useDeleteAdminWebFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminWebFeedbackService(id),
    onSuccess: () => {
      toast.success("Xóa nhận xét thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_WEB_FEEDBACKS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_WEB_FEEDBACKS"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Xóa thất bại, vui lòng thử lại!";
      toast.error(message);
    }
  });
};
