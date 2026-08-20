import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectStockCountService } from "../services/stockCount.reject.service";

export const useRejectStockCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectStockCountService,
    onSuccess: () => {
      toast.success("Đã từ chối phiếu kiểm kê.");
      queryClient.invalidateQueries({ queryKey: ["stock_counts"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi từ chối.");
    },
  });
};
