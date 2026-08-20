import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStockCountService } from "../services/stockCount.update.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { CreateStockCountFormValues } from "../schema/stockCount.create.schema";

export const useUpdateStockCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role, data }: { id: string, role: string, data: CreateStockCountFormValues }) => updateStockCountService(id, role, data),
    onSuccess: () => {
      toast.success("Cập nhật phiếu kiểm kho thành công!");
      queryClient.invalidateQueries({ queryKey: ['stock_counts'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};
