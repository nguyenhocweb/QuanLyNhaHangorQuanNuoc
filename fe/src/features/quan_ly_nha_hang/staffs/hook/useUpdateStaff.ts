import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaffService } from "../service/staff.update.service";
import { IUpdateStaffPayload } from "../type/staff.type";
import { toast } from "sonner";

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateStaffPayload }) => updateStaffService(id, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật nhân sự thành công!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-staffs"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật nhân sự";
      toast.error(msg);
    },
  });
};
