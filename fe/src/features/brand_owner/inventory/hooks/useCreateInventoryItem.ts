import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryItemService } from "../services/inventory_item.create.service";
import { toast } from "sonner";
import { InventoryItemFormValues } from "../schemas/inventory_item.schema";

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, data }: { brandId: string, data: InventoryItemFormValues }) => createInventoryItemService(brandId, data),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["brand-inventory-items", variables.brandId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
