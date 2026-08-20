import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveStockCountService } from "../services/stockCount.approve.service";

export const useApproveStockCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveStockCountService,
    onSuccess: () => {
      toast.success("Đã phê duyệt phiếu kiểm kê!");
      queryClient.invalidateQueries({ queryKey: ["stock_counts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi phê duyệt.");
    },
  });
};
