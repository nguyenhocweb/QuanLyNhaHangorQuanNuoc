import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutService } from "../service/cashier.checkout.service";
import { toast } from "sonner";

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutService,
    onSuccess: () => {
      toast.success("Thanh toán thành công!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant_tables"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Thanh toán thất bại");
    },
  });
};
