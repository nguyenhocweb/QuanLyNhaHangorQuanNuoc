import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAdminWebAuthorService } from "../service/web_author_admin.delete.service";

export const useDeleteAdminWebAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminWebAuthorService(id),
    onSuccess: () => {
      toast.success("Xóa thành viên thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_WEB_AUTHORS"] });
      queryClient.invalidateQueries({ queryKey: ["PUBLIC_WEB_AUTHORS"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Xóa thành viên thất bại!";
      toast.error(message);
    }
  });
};
