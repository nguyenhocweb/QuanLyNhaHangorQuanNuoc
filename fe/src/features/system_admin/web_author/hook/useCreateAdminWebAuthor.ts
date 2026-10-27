import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAdminWebAuthorService } from "../service/web_author_admin.create.service";
import { IAdminWebAuthor } from "../type/web_author_admin.type";

export const useCreateAdminWebAuthor = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IAdminWebAuthor>) => createAdminWebAuthorService(data),
    onSuccess: () => {
      toast.success("Thêm thành viên phát triển thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_WEB_AUTHORS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_WEB_AUTHORS"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Thêm thành viên thất bại!";
      toast.error(message);
    }
  });
};
