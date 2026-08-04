import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../service/usersSytem-service";
import { toast } from "sonner";
import { CreateUserFormValues } from "../schema/usersSytem-schema";

export const useCreateUserSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserFormValues) => {
      const { confirmPassword, ...payload } = data;
      return UserService.createUser(payload);
    },
    onSuccess: () => {
      toast.success("Tạo người dùng thành công!");
      // Invalidate the users query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng";
      toast.error(message);
    }
  });
};
