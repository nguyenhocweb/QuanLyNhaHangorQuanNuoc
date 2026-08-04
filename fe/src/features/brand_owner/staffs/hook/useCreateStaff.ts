import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createStaffService } from "../service/staff.create.service";
import { CreateStaffFormValues } from "../schema/staff.create.schema";

export const useCreateStaff = (brandId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffFormValues) => createStaffService(brandId, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Thêm mới nhân viên thành công!");
      // Invalidate both lists with/without params
      queryClient.invalidateQueries({ queryKey: ["staffs", brandId] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Có lỗi xảy ra khi thêm nhân viên.";
      toast.error(message);
    },
  });
};
