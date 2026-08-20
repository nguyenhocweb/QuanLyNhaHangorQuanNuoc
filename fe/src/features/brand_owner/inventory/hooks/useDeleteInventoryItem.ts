import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInventoryItemService } from "../services/inventory_item.delete.service";
import { toast } from "sonner";

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, itemId }: { brandId: string, itemId: string }) => deleteInventoryItemService(brandId, itemId),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["brand-inventory-items", variables.brandId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
