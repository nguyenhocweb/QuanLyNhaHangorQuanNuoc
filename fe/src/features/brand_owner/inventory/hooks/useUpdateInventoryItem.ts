import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventoryItemService } from "../services/inventory_item.update.service";
import { toast } from "sonner";
import { InventoryItemFormValues } from "../schemas/inventory_item.schema";

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, itemId, data }: { brandId: string, itemId: string, data: InventoryItemFormValues }) => updateInventoryItemService(brandId, itemId, data),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["brand-inventory-items", variables.brandId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
