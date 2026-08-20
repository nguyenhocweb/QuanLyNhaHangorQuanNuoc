import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitStockCountService } from "../services/stockCount.submit.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/core/lib/errorHandle";

export const useSubmitStockCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string, role: string }) => submitStockCountService(id, role),
    onSuccess: () => {
      toast.success("Nộp phiếu kiểm đếm thành công!");
      queryClient.invalidateQueries({ queryKey: ['stock_counts'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};
