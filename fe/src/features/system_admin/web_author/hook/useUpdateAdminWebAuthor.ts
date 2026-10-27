import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAdminWebAuthorService } from "../service/web_author_admin.update.service";
import { IAdminWebAuthor } from "../type/web_author_admin.type";

export const useUpdateAdminWebAuthor = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IAdminWebAuthor> }) =>
      updateAdminWebAuthorService(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành viên thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_WEB_AUTHORS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_WEB_AUTHORS"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Cập nhật thành viên thất bại!";
      toast.error(message);
    }
  });
};
