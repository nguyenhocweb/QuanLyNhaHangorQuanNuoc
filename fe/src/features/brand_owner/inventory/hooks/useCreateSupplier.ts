import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplierService } from "../services/supplier.create.service";
import { toast } from "sonner";
import { SupplierFormValues } from "../schemas/supplier.schema";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, data }: { brandId: string, data: SupplierFormValues }) => createSupplierService(brandId, data),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["brand-suppliers", variables.brandId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
