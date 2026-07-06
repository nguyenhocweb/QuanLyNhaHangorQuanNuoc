import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../service/usersSytem-service";
import { UpdateUserPayload } from "../type/usersSytem-type";
import { toast } from "sonner";

export const useUpdateUserSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number, payload: UpdateUserPayload }) => 
      UserService.updateUser(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    }
  });
};
