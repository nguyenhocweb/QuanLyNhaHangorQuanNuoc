import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSupplierService } from "../services/supplier.delete.service";
import { toast } from "sonner";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, supplierId }: { brandId: string, supplierId: string }) => deleteSupplierService(brandId, supplierId),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["brand-suppliers", variables.brandId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
