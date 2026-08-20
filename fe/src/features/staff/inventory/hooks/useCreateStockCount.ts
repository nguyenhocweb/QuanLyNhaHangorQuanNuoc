import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockCountService } from "../services/stockCount.create.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { CreateStockCountFormValues } from "@/src/features/brand_owner/inventory/schemas/stock_count.schema";

export const useCreateStockCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, role }: { data: CreateStockCountFormValues, role: string }) => createStockCountService(data, role),
    onSuccess: () => {
      toast.success("Tạo phiếu kiểm đếm thành công!");
      queryClient.invalidateQueries({ queryKey: ['stock_counts'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};
