import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/src/core/api/axios-instance";
import { toast } from "sonner";
import { PurchaseRequestFormValues } from "../schemas/purchase_request.schema";

export const useCreatePurchaseRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PurchaseRequestFormValues) => {
      const response = await axiosClient.post("/restaurant-manager/inventory/requests", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tạo yêu cầu nhập kho thành công");
      // Invalidate both requests list and stocks
      queryClient.invalidateQueries({ queryKey: ['manager_purchase_requests'] });
      queryClient.invalidateQueries({ queryKey: ['manager_stocks'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo yêu cầu");
    }
  });
};
