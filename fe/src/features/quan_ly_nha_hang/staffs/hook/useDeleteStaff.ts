import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaffService } from "../service/staff.delete.service";
import { toast } from "sonner";

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, restaurantId }: { id: string; restaurantId?: string }) => deleteStaffService(id, restaurantId),
    onSuccess: (data) => {
      toast.success(data.message || "Rút biên chế nhân viên thành công!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-staffs"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra khi rút biên chế nhân viên";
      toast.error(msg);
    },
  });
};
