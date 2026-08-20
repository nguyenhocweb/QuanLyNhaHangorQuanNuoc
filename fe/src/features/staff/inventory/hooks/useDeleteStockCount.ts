import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStockCountService } from "../services/stockCount.delete.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/core/lib/errorHandle";

export const useDeleteStockCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string, role: string }) => deleteStockCountService(id, role),
    onSuccess: () => {
      toast.success("Xóa phiếu kiểm kho thành công!");
      queryClient.invalidateQueries({ queryKey: ['stock_counts'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};
