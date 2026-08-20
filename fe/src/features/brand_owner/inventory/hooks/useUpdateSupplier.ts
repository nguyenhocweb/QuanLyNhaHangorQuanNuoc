import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplierService } from "../services/supplier.update.service";
import { toast } from "sonner";
import { SupplierFormValues } from "../schemas/supplier.schema";

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, supplierId, data }: { brandId: string, supplierId: string, data: SupplierFormValues }) => updateSupplierService(brandId, supplierId, data),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["brand-suppliers", variables.brandId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
