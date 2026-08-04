import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaffService } from "../service/staff.create.service";
import { ICreateStaffPayload } from "../type/staff.type";
import { toast } from "sonner";

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateStaffPayload) => createStaffService(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Thêm nhân sự thành công!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-staffs"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra khi thêm nhân sự";
      toast.error(msg);
    },
  });
};
