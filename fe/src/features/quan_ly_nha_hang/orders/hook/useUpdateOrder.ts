import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderUpdateService } from "../service/order.update.service";
import { toast } from "sonner";

export const useUpdateOrder = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => 
      orderUpdateService.updateOrder(id, { ...payload, restaurantId }),
    onSuccess: () => {
      toast.success("Cập nhật đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      // Invalidate tables status
      queryClient.invalidateQueries({ queryKey: ["TABLES"] });
      queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Đã có lỗi xảy ra!";
      toast.error(message);
    }
  });
};
